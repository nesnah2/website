// Quick test to verify MailerLite variable syntax
// Run this in browser console to test different syntaxes

async function testMailerLiteVariables() {
    console.log('🧪 Testing MailerLite Variable Syntax...\n');
    
    const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
    
    try {
        // Test 1: Check what fields are available
        console.log('1️⃣ Checking available fields...');
        const fieldsResponse = await fetch('https://connect.mailerlite.com/api/fields', {
            headers: {
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            }
        });
        
        if (fieldsResponse.ok) {
            const fields = await fieldsResponse.json();
            console.log('✅ Available fields:');
            fields.data.forEach(field => {
                console.log(`   - Key: "${field.key}" | Name: "${field.name}" | Type: ${field.type}`);
            });
            
            // Look for name-related fields
            const nameFields = fields.data.filter(field => 
                field.key.toLowerCase().includes('name') || 
                field.key.toLowerCase().includes('first')
            );
            
            if (nameFields.length > 0) {
                console.log('\n📝 Name-related fields found:');
                nameFields.forEach(field => {
                    console.log(`   - Use: {$${field.key}} for "${field.name}"`);
                });
            }
        }
        
        // Test 2: Check automations
        console.log('\n2️⃣ Checking automations...');
        const automationsResponse = await fetch('https://connect.mailerlite.com/api/automations', {
            headers: {
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            }
        });
        
        if (automationsResponse.ok) {
            const automations = await automationsResponse.json();
            console.log(`✅ Found ${automations.data.length} automations`);
            
            automations.data.forEach(auto => {
                console.log(`   - "${auto.name}" (Status: ${auto.status})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testMailerLiteVariables();



