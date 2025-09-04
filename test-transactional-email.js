// Test transactional email API
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';

async function testTransactionalEmail() {
    console.log('🧪 Testing Transactional Email API...\n');
    
    const testEmail = 'contact@mikkelhansen.org';
    const testContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50;">Test Email</h1>
            <p>This is a test email to verify the transactional email API is working.</p>
            <p>If you receive this, the email system is working correctly!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                <strong>Mikkel Hansen</strong><br>
                Men's Mentor
            </p>
        </body>
        </html>
    `;

    try {
        console.log('📧 Sending test email...');
        const response = await fetch('https://connect.mailerlite.com/api/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                to: testEmail,
                subject: 'Test - Email System Check',
                from: 'Mikkel Hansen <contact@mikkelhansen.org>',
                from_name: 'Mikkel Hansen',
                content: testContent
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Transactional email sent successfully!');
            console.log('📊 Response:', JSON.stringify(result, null, 2));
            console.log('\n📧 Check your email inbox for:');
            console.log('   - Subject: "Test - Email System Check"');
            console.log('   - From: Mikkel Hansen <contact@mikkelhansen.org>');
        } else {
            const errorText = await response.text();
            console.log('❌ Failed to send transactional email');
            console.log('Status:', response.status);
            console.log('Error:', errorText);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Run the test
testTransactionalEmail();
