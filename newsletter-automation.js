// Newsletter Automation System
// Automated weekly newsletter sending with MailerLite integration

const { sendEmailToAudience } = require('./email-campaign.js');

// Newsletter configuration
const NEWSLETTER_CONFIG = {
    groupId: '164535238277466018', // Newsletter group ID
    sendDay: 'tuesday', // Send every Tuesday
    sendTime: '09:00', // Send at 9 AM
    timezone: 'Europe/Copenhagen'
};

// Newsletter stories data
const NEWSLETTER_STORIES = [
    {
        week: 1,
        title: "The Performance Never Stops",
        subject: "The lie I told myself for 10 years",
        theme: "Authenticity vs. Performance",
        hook: "I was alone in my apartment, making coffee, when I caught myself performing.",
        story: "Three years ago, I was sitting in my therapist's office, exhausted from a day of meetings where I'd been 'on' the entire time...",
        lesson: "Most men don't realize they're performing. They think this is just 'how they are.' But it's not them - it's their default mode running on autopilot.",
        reflection: "When do I catch myself performing, even when no one is watching?",
        action: "Spend 10 minutes alone without any distractions. Notice what happens.",
        ps: "The first time I tried this exercise, I lasted 3 minutes before reaching for my phone."
    },
    {
        week: 2,
        title: "The Approval Addiction",
        subject: "Why I stopped seeking everyone's approval",
        theme: "External vs. Internal Validation",
        hook: "I was making a decision about my career when I realized I was asking everyone except myself.",
        story: "Last month, I had to choose between two job opportunities. Instead of listening to my gut, I called everyone I knew...",
        lesson: "You're seeking validation from everyone except yourself. Every decision, every word, every action is filtered through 'Will they approve?'",
        reflection: "What would I choose if no one else's opinion mattered?",
        action: "Make one decision this week without asking anyone's opinion.",
        ps: "The decision I made without asking anyone? It was the best one I've made in years."
    }
    // Add more stories as needed
];

// Generate newsletter HTML content
function generateNewsletterHTML(story, subscriberName) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${story.title} - Stories That Wake You Up</title>
            <style>
                /* Include the newsletter template styles here */
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
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .header .subtitle {
                    color: #b0b0b0;
                    font-size: 14px;
                    margin-top: 10px;
                    font-style: italic;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 18px;
                    color: #ffffff;
                    margin-bottom: 30px;
                    font-weight: 500;
                }
                
                .story-section {
                    margin: 40px 0;
                }
                
                .story-title {
                    color: #ffffff;
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                    line-height: 1.3;
                }
                
                .story-content {
                    font-size: 16px;
                    color: #b0b0b0;
                    line-height: 1.7;
                    margin-bottom: 30px;
                }
                
                .story-content p {
                    margin-bottom: 20px;
                }
                
                .lesson-section {
                    background-color: #3a3a3a;
                    border-left: 4px solid #667eea;
                    padding: 25px;
                    margin: 30px 0;
                    border-radius: 8px;
                }
                
                .lesson-section h3 {
                    color: #ffffff;
                    font-size: 18px;
                    margin: 0 0 15px 0;
                    font-weight: 600;
                }
                
                .lesson-section p {
                    color: #b0b0b0;
                    margin: 0 0 15px 0;
                    font-size: 15px;
                }
                
                .reflection-section {
                    background-color: #4a4a4a;
                    border: 1px solid #666666;
                    border-radius: 8px;
                    padding: 25px;
                    margin: 30px 0;
                }
                
                .reflection-section h3 {
                    color: #ffffff;
                    font-size: 18px;
                    margin: 0 0 15px 0;
                    font-weight: 600;
                }
                
                .reflection-question {
                    background-color: #5a5a5a;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid #ff6b6b;
                }
                
                .reflection-question p {
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                    font-style: italic;
                }
                
                .action-section {
                    background-color: #2a4a2a;
                    border-left: 4px solid #44cc44;
                    padding: 25px;
                    margin: 30px 0;
                    border-radius: 8px;
                }
                
                .action-section h3 {
                    color: #ffffff;
                    font-size: 18px;
                    margin: 0 0 15px 0;
                    font-weight: 600;
                }
                
                .action-section p {
                    color: #b0b0b0;
                    margin: 0;
                    font-size: 15px;
                }
                
                .closing {
                    margin: 40px 0 20px 0;
                    padding-top: 20px;
                    border-top: 1px solid #444444;
                }
                
                .closing p {
                    color: #b0b0b0;
                    font-size: 16px;
                    margin: 0 0 10px 0;
                }
                
                .signature {
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .ps-section {
                    background-color: #3a3a3a;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 30px 0;
                    border-left: 4px solid #ffa500;
                }
                
                .ps-section p {
                    color: #b0b0b0;
                    margin: 0;
                    font-size: 14px;
                    font-style: italic;
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
                <!-- Header -->
                <div class="header">
                    <h1>Stories That Wake You Up</h1>
                    <div class="subtitle">Your weekly dose of truth for men ready to break free</div>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                    <div class="greeting">
                        Hey ${subscriberName},
                    </div>
                    
                    <!-- Story Section -->
                    <div class="story-section">
                        <h2 class="story-title">${story.title}</h2>
                        <div class="story-content">
                            <p>${story.hook}</p>
                            <p>${story.story}</p>
                        </div>
                    </div>
                    
                    <!-- Lesson Section -->
                    <div class="lesson-section">
                        <h3>What This Teaches Us</h3>
                        <p>${story.lesson}</p>
                    </div>
                    
                    <!-- Reflection Section -->
                    <div class="reflection-section">
                        <h3>This Week's Reflection</h3>
                        <p>Take 10 minutes this week to sit with this question:</p>
                        
                        <div class="reflection-question">
                            <p>"${story.reflection}"</p>
                        </div>
                        
                        <p>Write down whatever comes up, even if it feels uncomfortable. The goal isn't to judge yourself - it's to see yourself clearly.</p>
                    </div>
                    
                    <!-- Action Section -->
                    <div class="action-section">
                        <h3>This Week's Action</h3>
                        <p>${story.action}</p>
                        <p>Keep it simple. Keep it specific. Keep it doable.</p>
                    </div>
                    
                    <!-- Closing -->
                    <div class="closing">
                        <p>You're not alone in this journey.</p>
                        <p class="signature">Keep waking up,<br>Mikkel</p>
                    </div>
                    
                    <!-- P.S. Section -->
                    <div class="ps-section">
                        <p><strong>P.S.</strong> ${story.ps}</p>
                    </div>
                    
                </div>
                
                <!-- Footer -->
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
                    
                    <div class="unsubscribe">
                        <p>You're receiving this because you signed up for "Stories That Wake You Up"</p>
                        <p><a href="{$unsubscribe}">Unsubscribe</a> | <a href="{$update_preferences}">Update Preferences</a></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Send newsletter to all subscribers
async function sendNewsletter(weekNumber) {
    try {
        const story = NEWSLETTER_STORIES.find(s => s.week === weekNumber);
        
        if (!story) {
            console.error(`❌ No story found for week ${weekNumber}`);
            return false;
        }
        
        console.log(`📧 Sending newsletter: Week ${weekNumber} - ${story.title}`);
        
        const htmlContent = generateNewsletterHTML(story, '{$name}');
        
        const result = await sendEmailToAudience(
            story.subject,
            htmlContent,
            NEWSLETTER_CONFIG.groupId
        );
        
        if (result) {
            console.log(`✅ Newsletter sent successfully! Week ${weekNumber}: ${story.title}`);
            return true;
        } else {
            console.log(`❌ Failed to send newsletter: Week ${weekNumber}`);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error sending newsletter:', error);
        return false;
    }
}

// Schedule newsletter sending
function scheduleNewsletter() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    // Check if it's Tuesday (day 2) and 9 AM
    if (dayOfWeek === 2 && hour === 9) {
        // Calculate week number (you can adjust this logic)
        const startDate = new Date('2024-01-01'); // Adjust start date
        const weeksSinceStart = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
        const weekNumber = (weeksSinceStart % NEWSLETTER_STORIES.length) + 1;
        
        sendNewsletter(weekNumber);
    }
}

// Manual newsletter sending function
async function sendManualNewsletter(weekNumber) {
    console.log(`📧 Manually sending newsletter for week ${weekNumber}...`);
    return await sendNewsletter(weekNumber);
}

// Test newsletter sending
async function testNewsletter() {
    console.log('🧪 Testing newsletter system...');
    return await sendNewsletter(1); // Send week 1 as test
}

// Export functions
module.exports = {
    sendNewsletter,
    sendManualNewsletter,
    testNewsletter,
    scheduleNewsletter,
    NEWSLETTER_STORIES,
    NEWSLETTER_CONFIG
};

// If running directly, test the system
if (require.main === module) {
    testNewsletter().then(success => {
        if (success) {
            console.log('✅ Newsletter system test completed successfully!');
        } else {
            console.log('❌ Newsletter system test failed!');
        }
        process.exit(success ? 0 : 1);
    });
}

