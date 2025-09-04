// Custom Email Sender
// Use this for more complex emails with custom HTML

const { sendEmailToAudience } = require('./email-campaign.js');

async function sendCustomEmail() {
    const subject = "Your Weekly Reflection Challenge";
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weekly Reflection Challenge</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50; text-align: center;">Your Weekly Reflection Challenge</h1>
            
            <p>Hey there,</p>
            
            <p>This week's challenge is simple but powerful:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2c3e50; margin-top: 0;">🎯 This Week's Question:</h3>
                <p style="font-size: 18px; font-weight: 600; color: #667eea;">
                    "What am I pretending to be that I'm not?"
                </p>
            </div>
            
            <p>Take 10 minutes this week to sit with this question. Write down whatever comes up, even if it feels uncomfortable.</p>
            
            <p><strong>Remember:</strong> The goal isn't to judge yourself. It's to see yourself clearly.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://mikkelhansen.org/boy-to-man-reflection-guide.html" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;">
                    Download Full Reflection Guide
                </a>
            </div>
            
            <p>Let me know what you discover!</p>
            
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
    
    console.log('📧 Sending custom email...');
    const result = await sendEmailToAudience(subject, htmlContent);
    
    if (result) {
        console.log('✅ Custom email sent successfully!');
    } else {
        console.log('❌ Failed to send custom email');
    }
}

// Run the function
sendCustomEmail();
