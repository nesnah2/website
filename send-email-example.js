// Example: How to send emails to your audience from Cursor
// Run this with: node send-email-example.js

const { sendEmailToAudience, sendNewsletter } = require('./email-campaign.js');

// Example 1: Send a simple newsletter
async function sendSimpleNewsletter() {
    const success = await sendNewsletter(
        'New Reflection Guide Available!',
        `
        <p>Hey there!</p>
        <p>I just created a new reflection guide that I think you'll find valuable.</p>
        <p>It's called "From Boy to Man: A Reflection Guide" and it's designed to help you:</p>
        <ul>
            <li>Break free from performance and approval-seeking</li>
            <li>Discover your authentic self</li>
            <li>Create your own reality instead of living for others</li>
        </ul>
        <p>You can download it for free at: <a href="https://mikkelhansen.org/email-signup.html">mikkelhansen.org/email-signup.html</a></p>
        <p>Let me know what you think!</p>
        <p>Best,<br>Mikkel</p>
        `
    );
    
    if (success) {
        console.log('✅ Newsletter sent successfully!');
    } else {
        console.log('❌ Failed to send newsletter');
    }
}

// Example 2: Send a custom email with HTML
async function sendCustomEmail() {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weekly Reflection</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50;">This Week's Reflection Question</h1>
            
            <p>Hey there,</p>
            
            <p>Here's a question to reflect on this week:</p>
            
            <blockquote style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; font-style: italic; color: #555;">
                "What would you do differently if you weren't trying to prove anything to anyone?"
            </blockquote>
            
            <p>Take a moment to really think about this. Write down your thoughts, or just sit with the question.</p>
            
            <p>Remember: Real transformation happens in the quiet moments of honest reflection.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                <strong>Mikkel Hansen</strong><br>
                Men's Mentor<br>
                <a href="https://mikkelhansen.org" style="color: #667eea;">mikkelhansen.org</a>
            </p>
        </body>
        </html>
    `;

    const success = await sendEmailToAudience(
        'This Week\'s Reflection Question',
        htmlContent
    );
    
    if (success) {
        console.log('✅ Custom email sent successfully!');
    } else {
        console.log('❌ Failed to send custom email');
    }
}

// Example 3: Send an announcement about new content
async function sendNewContentAnnouncement() {
    const success = await sendNewsletter(
        'New Video: Why Men Still Feel Like Boys',
        `
        <p>Hey there!</p>
        <p>I just uploaded a new video that I think will resonate with you.</p>
        <p>It's called "Why Men Still Feel Like Boys" and it explores the deeper reasons why so many men feel stuck in boyhood, even as adults.</p>
        <p>You can watch it here: <a href="https://youtube.com/@just__mikkel">YouTube</a></p>
        <p>Let me know what you think!</p>
        <p>Best,<br>Mikkel</p>
        `
    );
    
    if (success) {
        console.log('✅ Content announcement sent successfully!');
    } else {
        console.log('❌ Failed to send content announcement');
    }
}

// Run examples (uncomment the one you want to use)
// sendSimpleNewsletter();
// sendCustomEmail();
// sendNewContentAnnouncement();

console.log('📧 Email campaign examples ready!');
console.log('Uncomment one of the functions above to send an email to your audience.');
