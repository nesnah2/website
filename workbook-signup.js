// Workbook Download Email Signup Handler
// This script handles the email capture for the workbook download

const express = require('express');
const router = express.Router();

// Simple in-memory storage for demo purposes
// In production, you'd use a proper database
let subscribers = [];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Subscribe endpoint for workbook download
router.post('/api/subscribe', async (req, res) => {
    try {
        const { firstName, email, source } = req.body;
        
        // Validate required fields
        if (!firstName || !email) {
            return res.status(400).json({ 
                error: 'First name and email are required' 
            });
        }
        
        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Please enter a valid email address' 
            });
        }
        
        // Check if email already exists
        const existingSubscriber = subscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            // Update existing subscriber
            existingSubscriber.firstName = firstName;
            existingSubscriber.source = source || 'workbook_download';
            existingSubscriber.updatedAt = new Date();
        } else {
            // Add new subscriber
            subscribers.push({
                firstName,
                email,
                source: source || 'workbook_download',
                subscribedAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        // In production, you would:
        // 1. Save to your email service (MailerLite, ConvertKit, etc.)
        // 2. Send welcome email with workbook download link
        // 3. Add to your CRM
        
        console.log('New workbook subscriber:', { firstName, email, source });
        
        // Send welcome email (you'll need to implement this)
        await sendWelcomeEmail(firstName, email);
        
        res.json({ 
            success: true, 
            message: 'Successfully subscribed! Check your email for the workbook download link.' 
        });
        
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ 
            error: 'Something went wrong. Please try again.' 
        });
    }
});

// Function to send welcome email with workbook download
async function sendWelcomeEmail(firstName, email) {
    // This is a placeholder - you'll need to implement actual email sending
    // You can use services like:
    // - MailerLite API
    // - ConvertKit API  
    // - SendGrid
    // - Nodemailer with SMTP
    
    const emailContent = {
        to: email,
        subject: `Welcome ${firstName}! Your "From Boy to Man" Workbook is Ready`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a;">Welcome ${firstName}!</h2>
                
                <p>Thank you for downloading the "From Boy to Man" workbook. This isn't just another self-help guide - it's a tool for real transformation.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1a1a1a; margin-top: 0;">Your Workbook Includes:</h3>
                    <ul>
                        <li>8 powerful exercises to break free from limiting patterns</li>
                        <li>Honest self-reflection questions that will challenge you</li>
                        <li>Action steps you can take immediately</li>
                        <li>A clear path from boy behavior to authentic masculinity</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://mikkelhansen.org/workbook.html" 
                       style="background: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        Download Your Workbook Now
                    </a>
                </div>
                
                <p><strong>Important:</strong> This workbook will only work if you're honest with yourself. No sugar-coating, no feel-good fluff. Just real transformation.</p>
                
                <p>If you're ready to stop performing and start living authentically, this workbook is your first step.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">
                
                <p style="font-size: 14px; color: #6c757d;">
                    You're receiving this because you downloaded the workbook from mikkelhansen.org.<br>
                    If you have any questions, just reply to this email.
                </p>
                
                <p style="font-size: 14px; color: #6c757d;">
                    <strong>Mikkel Hansen</strong><br>
                    Men's Mentor & Transformation Coach
                </p>
            </div>
        `
    };
    
    // TODO: Implement actual email sending
    console.log('Would send email:', emailContent);
    
    // For now, just log the email content
    // In production, you'd use your email service API here
}

// Get subscribers endpoint (for admin purposes)
router.get('/api/subscribers', (req, res) => {
    res.json({
        count: subscribers.length,
        subscribers: subscribers.map(sub => ({
            firstName: sub.firstName,
            email: sub.email,
            source: sub.source,
            subscribedAt: sub.subscribedAt
        }))
    });
});

module.exports = router;

// If running this file directly, start a simple server for testing
if (require.main === module) {
    const app = express();
    app.use(express.json());
    app.use(router);
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Workbook signup server running on port ${PORT}`);
    });
}

