// Simple test - just add subscriber (this should work)
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const MAILERLITE_GROUP_ID = '164535238277466018';

async function testSimpleSignup() {
    console.log('🧪 Testing Simple Signup (Subscriber Addition Only)...\n');
    
    const testEmail = 'test-' + Date.now() + '@example.com';
    const testName = 'Test User';
    
    console.log('📝 Test Data:');
    console.log('   Email:', testEmail);
    console.log('   Name:', testName);
    console.log('   Group ID:', MAILERLITE_GROUP_ID);
    console.log('\n⏳ Adding subscriber to MailerLite...\n');

    try {
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                email: testEmail,
                fields: {
                    name: testName
                },
                groups: [MAILERLITE_GROUP_ID]
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS! Subscriber added successfully!');
            console.log('📊 Response:', JSON.stringify(result, null, 2));
            console.log('\n🎉 This means your signup form will work!');
            console.log('\n📧 Next steps:');
            console.log('1. Set up domain authentication in MailerLite');
            console.log('2. Add the DNS records they provide');
            console.log('3. Wait 24-48 hours for DNS propagation');
            console.log('4. Test the full email flow again');
        } else {
            const errorText = await response.text();
            console.log('❌ FAILED to add subscriber');
            console.log('Status:', response.status);
            console.log('Error:', errorText);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Run the test
testSimpleSignup();
