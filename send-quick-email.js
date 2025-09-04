// Quick Email Sender
// Run this to send an email to your audience

const { sendNewsletter } = require('./email-campaign.js');

async function sendQuickEmail() {
    const subject = "New Video: Why Men Still Feel Like Boys";
    const message = `
        <p>Hey there,</p>
        
        <p>I just uploaded a new video that I think will resonate with many of you.</p>
        
        <p><strong>Why Men Still Feel Like Boys</strong></p>
        
        <p>In this video, I talk about:</p>
        <ul>
            <li>The hidden reasons men stay stuck in boyhood</li>
            <li>How to recognize when you're acting from fear vs. courage</li>
            <li>The difference between vulnerability and self-pity</li>
        </ul>
        
        <p>Watch it here: <a href="https://youtube.com/@just__mikkel" style="color: #667eea;">YouTube Channel</a></p>
        
        <p>Let me know what you think!</p>
        
        <p>Best,<br>Mikkel</p>
    `;
    
    console.log('📧 Sending email...');
    const result = await sendNewsletter(subject, message);
    
    if (result) {
        console.log('✅ Email sent successfully!');
    } else {
        console.log('❌ Failed to send email');
    }
}

// Run the function
sendQuickEmail();
