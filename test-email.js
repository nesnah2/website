// Test Email Functionality
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const GROUP_ID = '164535238277466018';

// Test API Connection
async function testAPIConnection() {
    console.log('🔍 Testing API Connection...');
    try {
        const response = await fetch('https://connect.mailerlite.com/api/groups', {
            headers: { 'Authorization': `Bearer ${MAILERLITE_API_KEY}` }
        });
        if (response.ok) {
            const groups = await response.json();
            console.log('✅ API Connection: SUCCESS');
            console.log('📊 Available Groups:', groups.data.length);
            return true;
        } else {
            console.log('❌ API Connection: FAILED');
            return false;
        }
    } catch (error) {
        console.log('❌ API Connection: ERROR', error.message);
        return false;
    }
}

// Test Group Subscribers
async function testGroupSubscribers() {
    console.log('\n👥 Testing Group Subscribers...');
    try {
        const response = await fetch(`https://connect.mailerlite.com/api/groups/${GROUP_ID}/subscribers`, {
            headers: { 'Authorization': `Bearer ${MAILERLITE_API_KEY}` }
        });
        if (response.ok) {
            const subscribers = await response.json();
            console.log('✅ Group Subscribers: SUCCESS');
            console.log('📧 Total Subscribers:', subscribers.data.length);
            return true;
        } else {
            console.log('❌ Group Subscribers: FAILED');
            return false;
        }
    } catch (error) {
        console.log('❌ Group Subscribers: ERROR', error.message);
        return false;
    }
}

// Test Campaign Creation
async function testCampaignCreation() {
    console.log('\n📧 Testing Campaign Creation...');
    try {
        const response = await fetch('https://connect.mailerlite.com/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                name: 'TEST - Email System Check',
                type: 'regular',
                subject: 'TEST - Email System Check',
                from: 'Mikkel Hansen <contact@mikkelhansen.org>',
                from_name: 'Mikkel Hansen',
                reply_to: 'contact@mikkelhansen.org',
                emails: [{
                    subject: 'TEST - Email System Check',
                    from_name: 'Mikkel Hansen',
                    from: 'contact@mikkelhansen.org',
                    content: {
                        html: '<h1>Test Email</h1><p>This is a test to verify the email system is working.</p>',
                        plain: 'Test Email - This is a test to verify the email system is working.'
                    }
                }],
                groups: [GROUP_ID]
            })
        });
        
        if (response.ok) {
            const campaign = await response.json();
            console.log('✅ Campaign Creation: SUCCESS');
            console.log('📝 Campaign ID:', campaign.data.id);
            
            // Clean up - delete the test campaign
            await fetch(`https://connect.mailerlite.com/api/campaigns/${campaign.data.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${MAILERLITE_API_KEY}` }
            });
            console.log('🧹 Test campaign deleted');
            return true;
        } else {
            const errorData = await response.text();
            console.log('❌ Campaign Creation: FAILED');
            console.log('Status:', response.status);
            console.log('Error Details:', errorData);
            return false;
        }
    } catch (error) {
        console.log('❌ Campaign Creation: ERROR', error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting Email System Tests...\n');
    
    const apiTest = await testAPIConnection();
    const subscriberTest = await testGroupSubscribers();
    const campaignTest = await testCampaignCreation();
    
    console.log('\n📋 Test Results Summary:');
    console.log('API Connection:', apiTest ? '✅ PASS' : '❌ FAIL');
    console.log('Group Subscribers:', subscriberTest ? '✅ PASS' : '❌ FAIL');
    console.log('Campaign Creation:', campaignTest ? '✅ PASS' : '❌ FAIL');
    
    if (apiTest && subscriberTest && campaignTest) {
        console.log('\n🎉 ALL TESTS PASSED! Your email system is working correctly.');
        console.log('\n📝 Next Steps:');
        console.log('1. Test the signup form on your website');
        console.log('2. Check your MailerLite dashboard for new subscribers');
        console.log('3. Verify welcome emails are being sent');
    } else {
        console.log('\n⚠️  Some tests failed. Please check your API key and group ID.');
    }
}

runAllTests();
