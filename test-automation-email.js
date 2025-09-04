// Test Automation Email
// Using MailerLite's automation API

const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const GROUP_ID = '164535238277466018';

async function testAutomationEmail() {
    console.log('🧪 Testing Automation Email...\n');
    
    const testEmail = 'contact@mikkelhansen.org';
    const firstName = 'Test';
    
    const welcomeEmailContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Reflection Guide is Here</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50;">Your Reflection Guide is Ready!</h1>
            
            <p>Hey ${firstName},</p>
            
            <p>Thank you for signing up! Your "From Boy to Man: A Reflection Guide" is ready for download.</p>
            
            <p>This guide will help you:</p>
            <ul>
                <li>Break free from performance and approval-seeking</li>
                <li>Discover your authentic self</li>
                <li>Create your own reality instead of living for others</li>
                <li>Transform from a boy seeking validation to a man who lives on his own terms</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://mikkelhansen.org/boy-to-man-reflection-guide.html" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                    Download Your Guide
                </a>
            </div>
            
            <p><strong>Important:</strong> This guide is designed for deep reflection. Take your time with each question and be honest with yourself.</p>
            
            <p>If you have any questions or want to share your thoughts, feel free to reply to this email.</p>
            
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

    try {
        // Try to send email using automation
        console.log('📧 Creating automation email...');
        const automationResponse = await fetch('https://connect.mailerlite.com/api/automations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                name: `Welcome ${firstName} - Reflection Guide`,
                type: 'welcome',
                subject: 'Your Reflection Guide is Here',
                from: 'Mikkel Hansen <contact@mikkelhansen.org>',
                from_name: 'Mikkel Hansen',
                content: welcomeEmailContent,
                groups: [GROUP_ID]
            })
        });

        if (automationResponse.ok) {
            const automation = await automationResponse.json();
            console.log('✅ Automation created successfully!');
            console.log('Automation ID:', automation.data.id);
        } else {
            const errorText = await automationResponse.text();
            console.log('❌ Automation Creation Failed');
            console.log('Status:', automationResponse.status);
            console.log('Error:', errorText);
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Run the test
testAutomationEmail();
