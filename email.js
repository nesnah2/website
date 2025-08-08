import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  // Check if we have the required environment variables
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send contact form email
export const sendContactEmail = async (contactData) => {
  const { name, email, message } = contactData;
  
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email configuration is missing');
  }
  
  // Email to the site owner
  const ownerMailOptions = {
    from: `"Men's Mentoring Website" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}

      
      Message:
      ${message}
    `,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };
  
  // Auto-reply to the sender
  const autoReplyOptions = {
    from: `"Mikkel Hansen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank You for Contacting Men\'s Mentoring',
    text: `
      Hello ${name},
      
      Thank you for reaching out. I've received your message and will get back to you within 24 hours.
      
      Best regards,
      Mikkel Hansen
      Men's Mentoring
    `,
    html: `
      <p>Hello ${name},</p>
      <p>Thank you for reaching out. I've received your message and will get back to you within 24 hours.</p>
      <p>Best regards,<br>Mikkel Hansen<br>Men's Mentoring</p>
    `,
  };
  
  try {
    // Send email to owner
    await transporter.sendMail(ownerMailOptions);
    
    // Send auto-reply to user
    await transporter.sendMail(autoReplyOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send session booking confirmation
export const sendBookingConfirmation = async (bookingData) => {
  const { name, email, phone, package: packageType, preferredDate, message } = bookingData;
  
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email configuration is missing');
  }
  
  // Email to the site owner
  const ownerMailOptions = {
    from: `"Men's Mentoring Website" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    subject: `New Session Booking from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Package: ${packageType}
      Preferred Date: ${preferredDate || 'Not specified'}
      
      Message:
      ${message || 'No additional message'}
    `,
    html: `
      <h3>New Session Booking</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Package:</strong> ${packageType}</p>
      <p><strong>Preferred Date:</strong> ${preferredDate || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${(message || 'No additional message').replace(/\n/g, '<br>')}</p>
    `,
  };
  
  // Confirmation email to the client
  const clientMailOptions = {
    from: `"Mikkel Hansen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Men\'s Mentoring Session Booking',
    text: `
      Hello ${name},
      
      Thank you for booking a session with Men's Mentoring. I've received your request for the ${packageType} package.
      
      I'll contact you within 24 hours to confirm the details and schedule our session.
      
      Best regards,
      Mikkel Hansen
      Men's Mentoring
    `,
    html: `
      <p>Hello ${name},</p>
      <p>Thank you for booking a session with Men's Mentoring. I've received your request for the <strong>${packageType}</strong> package.</p>
      <p>I'll contact you within 24 hours to confirm the details and schedule our session.</p>
      <p>Best regards,<br>Mikkel Hansen<br>Men's Mentoring</p>
    `,
  };
  
  try {
    // Send email to owner
    await transporter.sendMail(ownerMailOptions);
    
    // Send confirmation to client
    await transporter.sendMail(clientMailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send newsletter subscription confirmation
export const sendNewsletterConfirmation = async (subscriptionData) => {
  const { email, name } = subscriptionData;
  
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email configuration is missing');
  }
  
  // Confirmation email to subscriber
  const subscriberMailOptions = {
    from: `"Mikkel Hansen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Men\'s Mentoring Newsletter',
    text: `
      Hello ${name || 'there'},
      
      Thank you for subscribing to the Men's Mentoring newsletter. You'll receive valuable insights and updates to help you on your journey.
      
      Best regards,
      Mikkel Hansen
      Men's Mentoring
    `,
    html: `
      <p>Hello ${name || 'there'},</p>
      <p>Thank you for subscribing to the Men's Mentoring newsletter. You'll receive valuable insights and updates to help you on your journey.</p>
      <p>Best regards,<br>Mikkel Hansen<br>Men's Mentoring</p>
    `,
  };
  
  try {
    // Send confirmation to subscriber
    await transporter.sendMail(subscriberMailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export default {
  sendContactEmail,
  sendBookingConfirmation,
  sendNewsletterConfirmation
};
