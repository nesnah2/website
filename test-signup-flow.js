// Test the actual signup flow that visitors will use
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const MAILERLITE_GROUP_ID = '164535238277466018';

// Test data
const testData = {
    firstName: 'Mikkel',
    email: 'contact@mikkelhansen.org' // Your real email to test
};

async function testSignupFlow() {
    console.log('🧪 Testing Signup Flow...\n');
    console.log('📝 Test Data:', testData);
    console.log('⏳ Simulating form submission...\n');

    try {
        // Step 1: Add subscriber to MailerLite (same as your website)
        console.log('1️⃣ Adding subscriber to MailerLite...');
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                email: testData.email,
                fields: {
                    name: testData.firstName
                },
                groups: [MAILERLITE_GROUP_ID]
            })
        });

        if (response.ok) {
            console.log('✅ Subscriber added successfully!');
            
            // Step 2: Send welcome email with guide (same as your website)
            console.log('2️⃣ Sending welcome email with guide...');
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
                    
                    <p>Hey ${testData.firstName},</p>
                    
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

            // Send welcome email
            const emailResponse = await fetch('https://connect.mailerlite.com/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MAILERLITE_API_KEY}`
                },
                body: JSON.stringify({
                    name: `Welcome ${testData.firstName} - Reflection Guide`,
                    type: 'regular',
                    subject: 'Your Reflection Guide is Here',
                    from: 'Mikkel Hansen <contact@mikkelhansen.org>',
                    from_name: 'Mikkel Hansen',
                    reply_to: 'contact@mikkelhansen.org',
                    content: {
                        html: welcomeEmailContent,
                        plain: welcomeEmailContent.replace(/<[^>]*>/g, '')
                    },
                    groups: [MAILERLITE_GROUP_ID],
                    emails: [{
                        subject: 'Your Reflection Guide is Here',
                        from_name: 'Mikkel Hansen',
                        from: 'contact@mikkelhansen.org',
                        content: welcomeEmailContent
                    }]
                })
            });

            if (emailResponse.ok) {
                const campaign = await emailResponse.json();
                console.log('✅ Welcome email campaign created!');
                
                // Send the campaign
                const sendResponse = await fetch(`https://connect.mailerlite.com/api/campaigns/${campaign.data.id}/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MAILERLITE_API_KEY}`
                    }
                });

                if (sendResponse.ok) {
                    console.log('✅ Welcome email sent successfully!');
                    console.log('\n🎉 SIGNUP FLOW TEST COMPLETE!');
                    console.log('\n📧 Check your email inbox for:');
                    console.log('   - Subject: "Your Reflection Guide is Here"');
                    console.log('   - From: Mikkel Hansen <contact@mikkelhansen.org>');
                    console.log('   - Contains: Download link to your guide');
                } else {
                    const sendErrorData = await sendResponse.text();
                    console.log('❌ Failed to send welcome email');
                    console.log('Send Status:', sendResponse.status);
                    console.log('Send Error Details:', sendErrorData);
                }
            } else {
                const errorData = await emailResponse.text();
                console.log('❌ Failed to create welcome email campaign');
                console.log('Status:', emailResponse.status);
                console.log('Error Details:', errorData);
            }
        } else {
            console.log('❌ Failed to add subscriber');
        }
    } catch (error) {
        console.error('❌ Error during signup flow:', error);
    }
}

// Instructions
console.log('📋 SIGNUP FLOW TEST INSTRUCTIONS:');
console.log('1. Change the email in testData to your real email');
console.log('2. Run this script to test the exact flow your visitors will use');
console.log('3. Check your email for the welcome message with guide download link');
console.log('\n');

// Run the test
testSignupFlow();
