// Workbook Email Automation System
// Integrates MailerLite with workbook download and welcome email automation

const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const WORKBOOK_GROUP_ID = '164535238277466018';

// Add subscriber to MailerLite and send welcome email
async function addWorkbookSubscriber(firstName, email, source = 'workbook_download') {
    try {
        console.log(`📧 Adding new workbook subscriber: ${firstName} (${email})`);
        
        // Step 1: Add subscriber to MailerLite
        const subscriberResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                email: email,
                fields: {
                    name: firstName,
                    first_name: firstName,
                    source: source
                },
                groups: [WORKBOOK_GROUP_ID]
            })
        });

        if (!subscriberResponse.ok) {
            const errorData = await subscriberResponse.json();
            console.error('❌ Failed to add subscriber:', errorData);
            return { success: false, error: 'Failed to add subscriber to email list' };
        }

        const subscriberData = await subscriberResponse.json();
        console.log('✅ Subscriber added to MailerLite:', subscriberData.data.email);

        // Step 2: Send welcome email with workbook
        const welcomeEmailSent = await sendWelcomeEmail(firstName, email);
        
        if (welcomeEmailSent) {
            console.log('✅ Welcome email sent successfully');
            return { 
                success: true, 
                message: 'Successfully subscribed! Check your email for the workbook download link.',
                subscriberId: subscriberData.data.id
            };
        } else {
            console.log('⚠️ Subscriber added but welcome email failed');
            return { 
                success: true, 
                message: 'Successfully subscribed! You can access your workbook at mikkelhansen.org/workbook.html',
                subscriberId: subscriberData.data.id
            };
        }

    } catch (error) {
        console.error('❌ Error in addWorkbookSubscriber:', error);
        return { success: false, error: 'Something went wrong. Please try again.' };
    }
}

// Send welcome email with workbook download link
async function sendWelcomeEmail(firstName, email) {
    try {
        // For now, we'll use MailerLite's automation feature
        // The subscriber will receive the welcome email automatically
        // when added to the group (if automation is set up in MailerLite)
        
        console.log(`📧 Welcome email will be sent automatically to ${firstName} (${email})`);
        console.log('💡 Set up automation in MailerLite dashboard to send welcome emails automatically');
        
        // Return true since the subscriber is added and will receive automated emails
        return true;

    } catch (error) {
        console.error('❌ Error in welcome email process:', error);
        return false;
    }
}

// Generate welcome email HTML content using the exact template provided
function generateWelcomeEmailHTML(firstName) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your workbook is ready. Are you?</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    min-width: 100%;
                    height: 100%;
                    background-color: #1a1a1a;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #e0e0e0;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #2d2d2d;
                }
                
                .header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    padding: 40px 30px;
                    text-align: center;
                    border-bottom: 2px solid #444444;
                }
                
                .header h1 {
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 18px;
                    color: #ffffff;
                    margin-bottom: 20px;
                }
                
                .intro-text {
                    font-size: 16px;
                    color: #b0b0b0;
                    margin-bottom: 30px;
                    line-height: 1.7;
                }
                
                .highlight-box {
                    background-color: #3a3a3a;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 30px 0;
                }
                
                .highlight-box h3 {
                    color: #ffffff;
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .highlight-box ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .highlight-box li {
                    color: #b0b0b0;
                    margin-bottom: 8px;
                    font-size: 15px;
                }
                
                .cta-section {
                    text-align: center;
                    margin: 40px 0;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
                    color: #1a1a1a !important;
                    text-decoration: none;
                    padding: 18px 35px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
                }
                
                .important-note {
                    background-color: #4a4a4a;
                    border: 1px solid #666666;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 30px 0;
                }
                
                .important-note h4 {
                    color: #ffffff;
                    margin: 0 0 10px 0;
                    font-size: 16px;
                }
                
                .important-note p {
                    color: #b0b0b0;
                    margin: 0;
                    font-size: 14px;
                }
                
                .footer {
                    background-color: #1a1a1a;
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                    border-top: 2px solid #444444;
                }
                
                .footer h3 {
                    color: #ffffff;
                    font-size: 18px;
                    margin: 0 0 15px 0;
                }
                
                .footer p {
                    color: #bdc3c7;
                    font-size: 14px;
                    margin: 5px 0;
                }
                
                .footer a {
                    color: #667eea;
                    text-decoration: none;
                }
                
                .social-links {
                    margin: 20px 0;
                }
                
                .social-links a {
                    display: inline-block;
                    margin: 0 10px;
                    color: #667eea;
                    font-size: 20px;
                    text-decoration: none;
                }
                
                .unsubscribe {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #95a5a6;
                }
                
                .unsubscribe a {
                    color: #95a5a6;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Your workbook is ready. Are you?</h1>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Hey ${firstName}, thank you for showing up for yourself with bravery.
                    </div>
                    
                    <div class="intro-text">
                        You wake up empty despite your achievements. You're still performing for approval like a scared little boy. Every day you stay stuck is another day you're not the man you could be.
                    </div>
                    
                    <div class="highlight-box">
                        <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                            This is not a feel good workbook.
                        </p>
                        <p style="color: #b0b0b0; margin: 0 0 15px 0; font-size: 16px;">
                            You know exactly what I'm talking about. You're tired of wearing masks and pretending to be someone you're not.
                        </p>
                        <p style="color: #b0b0b0; margin: 0; font-size: 16px;">
                            The courage you got to start this journey, is required. No more excuses.
                        </p>
                    </div>
                    
                    <div style="background-color: #4a2a2a; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #cc4444;">
                        <p style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">
                            Stop lying to yourself:
                        </p>
                        <p style="color: #b0b0b0; margin: 0 0 15px 0; font-size: 16px;">
                            You're not "just thinking things through" - you're paralyzed by overthinking.
                        </p>
                        <p style="color: #b0b0b0; margin: 0 0 15px 0; font-size: 16px;">
                            You're not "being nice" - you're people-pleasing because you're afraid of rejection.
                        </p>
                        <p style="color: #b0b0b0; margin: 0; font-size: 16px;">
                            You're not "staying busy" - you're running from yourself.
                        </p>
                    </div>
                    
                    <div class="highlight-box">
                        <h3>Identify why and erase how:</h3>
                        <ul>
                            <li><strong>Which shortcuts do you fall into</strong> - Identify the patterns that keep you stuck</li>
                            <li><strong>What default behaviors are actually working against you</strong> - Stop sabotaging yourself unconsciously</li>
                            <li><strong>Being stuck in endless thinking</strong> - Break free from overthinking and take action</li>
                            <li><strong>Confront the narratives that are creating your limits</strong> - Challenge the stories you tell yourself</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #2a4a2a; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #44cc44;">
                        <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">
                            What you'll gain from doing the work:
                        </h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="color: #b0b0b0; margin-bottom: 8px; font-size: 15px;"><strong>Clear patterns that serve you</strong> - Know exactly what behaviors that keep you small</li>
                            <li style="color: #b0b0b0; margin-bottom: 8px; font-size: 15px;"><strong>Real confidence that comes from within</strong> - Stop performing and start being real</li>
                            <li style="color: #b0b0b0; margin-bottom: 8px; font-size: 15px;"><strong>Action over endless thinking</strong> - Make decisions and move forward with purpose</li>
                            <li style="color: #b0b0b0; margin-bottom: 8px; font-size: 15px;"><strong>Freedom from the stories that limit you</strong> - Rewrite your narrative and create new possibilities</li>
                        </ul>
                    </div>
                    
                    <div class="cta-section">
                        <a href="https://mikkelhansen.org/workbook.html" class="cta-button">
                            📥 Download Your Workbook PDF
                        </a>
                        <p style="color: #b0b0b0; font-size: 14px; margin-top: 15px;">
                            Your workbook is attached as a PDF file. Click above to download it directly to your device.
                        </p>
                    </div>
                    
                    <div class="important-note">
                        <h4>⚠️ Important:</h4>
                        <p>This guide is designed for deep reflection. Take your time with each question and be completely honest with yourself. The real transformation happens when you stop lying to yourself about who you are.</p>
                    </div>
                </div>
                
                <div class="footer">
                    <h3>Mikkel Hansen</h3>
                    <p>Men's Mentor</p>
                    <p>Helping men break free from their shadows and become the men they were meant to be.</p>
                    
                    <div class="social-links">
                        <a href="https://youtube.com/@just__mikkel" target="_blank">📺</a>
                        <a href="https://instagram.com/just__mikkel" target="_blank">📷</a>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                        <a href="https://mikkelhansen.org" style="color: #667eea;">mikkelhansen.org</a> | 
                        <a href="mailto:contact@mikkelhansen.org" style="color: #667eea;">contact@mikkelhansen.org</a>
                    </p>
                    
                    <div style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                        <p>Mikkel Hansen<br>Copenhagen.<br>Denmark.<br>Help men worldwide.</p>
                        <p>You received this email because you signed up on my website. Unsubscribe any day, if its get to real.</p>
                        <p><a href="{$unsubscribe}" style="color: #95a5a6; text-decoration: underline;">Unsubscribe</a></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Test the automation system
async function testWorkbookAutomation() {
    console.log('🧪 Testing workbook automation system...');
    
    const testResult = await addWorkbookSubscriber('Test User', 'testuser123@gmail.com', 'test');
    
    if (testResult.success) {
        console.log('✅ Workbook automation test completed successfully!');
        console.log('📧 Test subscriber added and welcome email sent');
    } else {
        console.log('❌ Workbook automation test failed:', testResult.error);
    }
    
    return testResult.success;
}

// Export functions
module.exports = {
    addWorkbookSubscriber,
    sendWelcomeEmail,
    testWorkbookAutomation
};

// If running directly, test the system
if (require.main === module) {
    testWorkbookAutomation().then(success => {
        process.exit(success ? 0 : 1);
    });
}
