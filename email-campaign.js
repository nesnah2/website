// Email Campaign Sender for MailerLite
// This script allows you to send emails to your audience directly from Cursor

const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2NmZWM4NmM5YzMyN2ExNWZhYWJjM2Q4OWRlNGFkYzEzNDEyOGNjYmZiOTcxYTc1ZGQ2NjAzNjY0MjE4YjNlNDY4YzZmOGQ2YzkzNDgyYjAiLCJpYXQiOjE3NTY5MTIxNzMuNDI2MzEzLCJuYmYiOjE3NTY5MTIxNzMuNDI2MzE2LCJleHAiOjQ5MTI1ODU3NzMuNDIxODcsInN1YiI6IjE3OTAzMjAiLCJzY29wZXMiOltdfQ.v0Z7VSyrgB7zTYTkfxZKfJjtep0KBje-wQHOnnpB0c3siyRu9gRUtguXvuV6H-QtQikR-IPSKD20rlGTEGUeQ7U2vV3iVFltrQPzYRhDrbdaqOdMJUFmquSLc2lIYE-wChea9dOIRTehYHs5IOjcMj8j7bbMhzPhSbaAIGQrLvvgHMtHlQpp_Q831uOIRIlIWljUAb6sJ3bduRTj1bmrDXwRUfYIu0PH_JnxU11NuDE1UYgr2JA__nTYy9_AIlGoiEK6MPkF66ukLhF7XpcGUaMuH_w67K5BzpnLJODlRu64JGHEmFremA7AyQlzvX0_DwO0BDBzxR11IXqFItVoLNGaScCEJUkSeVaQgXgrxXElbgUFGchYxUpwYY_1yx63H9NHqagPM2Tuu7UaswwFXhvAHbOH5JVm-8wJGIe_VqMQIw10A_MU1lOiKnSbRqQ1vqCcKqIKoCDsyYsWWRQ3B590kwx3Zx0PoThK_y2u9YAR8zwYG_7eIY7X8m8lRsdpRxlAY0KHu0X9Ok1vqtsHKgB5Vk7fi5UfVXjGMZ-cn9JZOZCUbHEUyw3NITijhrgtqfGpooyjPrfNDR98HmNcHcll76IjMIuthx6SaPVBYOFMd1AE5jLRYm_gJr3lVuTl0_wCIb0C-USP5-StwzY2BtjDfErjOh0vxigvExKe61c';
const GROUP_ID = '164535238277466018';

// Function to send email to your audience
async function sendEmailToAudience(subject, content, previewText = '') {
    try {
        // Step 1: Create a campaign
        const campaignResponse = await fetch('https://connect.mailerlite.com/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                name: subject,
                type: 'regular',
                subject: subject,
                from: 'Mikkel Hansen <contact@mikkelhansen.org>',
                from_name: 'Mikkel Hansen',
                reply_to: 'contact@mikkelhansen.org',
                content: {
                    html: content,
                    plain: content.replace(/<[^>]*>/g, '') // Strip HTML for plain text
                },
                groups: [GROUP_ID]
            })
        });

        if (!campaignResponse.ok) {
            throw new Error('Failed to create campaign');
        }

        const campaign = await campaignResponse.json();
        console.log('Campaign created:', campaign);

        // Step 2: Send the campaign
        const sendResponse = await fetch(`https://connect.mailerlite.com/api/campaigns/${campaign.data.id}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            }
        });

        if (!sendResponse.ok) {
            throw new Error('Failed to send campaign');
        }

        console.log('Email sent successfully!');
        return true;

    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Example usage:
// sendEmailToAudience(
//     'New Reflection Guide Available!',
//     `
//     <h1>Hey there!</h1>
//     <p>I just created a new reflection guide that I think you'll find valuable.</p>
//     <p>Check it out and let me know what you think!</p>
//     <p>Best,<br>Mikkel</p>
//     `
// );

// Function to send a simple newsletter
async function sendNewsletter(subject, message) {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50;">${subject}</h1>
            <div style="margin: 20px 0;">
                ${message}
            </div>
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

    return await sendEmailToAudience(subject, htmlContent);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendEmailToAudience, sendNewsletter };
}
