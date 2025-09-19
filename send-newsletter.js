// Manual Newsletter Sender
// Use this to send newsletters manually

const { sendManualNewsletter, NEWSLETTER_STORIES } = require('./newsletter-automation.js');

async function sendWeeklyNewsletter() {
    // Get week number from command line argument or default to 1
    const weekNumber = process.argv[2] ? parseInt(process.argv[2]) : 1;
    
    if (weekNumber < 1 || weekNumber > NEWSLETTER_STORIES.length) {
        console.error(`❌ Invalid week number. Please use 1-${NEWSLETTER_STORIES.length}`);
        process.exit(1);
    }
    
    const story = NEWSLETTER_STORIES[weekNumber - 1];
    console.log(`📧 Sending newsletter: Week ${weekNumber} - "${story.title}"`);
    console.log(`📧 Subject: "${story.subject}"`);
    console.log(`📧 Theme: ${story.theme}`);
    
    const success = await sendManualNewsletter(weekNumber);
    
    if (success) {
        console.log(`✅ Newsletter sent successfully!`);
        console.log(`📊 Week ${weekNumber}: "${story.title}"`);
        console.log(`📊 Theme: ${story.theme}`);
        console.log(`📊 Action: ${story.action}`);
    } else {
        console.log(`❌ Failed to send newsletter`);
        process.exit(1);
    }
}

// Show available stories
function showAvailableStories() {
    console.log('📚 Available Newsletter Stories:');
    console.log('');
    
    NEWSLETTER_STORIES.forEach((story, index) => {
        console.log(`Week ${story.week}: "${story.title}"`);
        console.log(`   Subject: "${story.subject}"`);
        console.log(`   Theme: ${story.theme}`);
        console.log(`   Action: ${story.action}`);
        console.log('');
    });
    
    console.log('Usage: node send-newsletter.js [week_number]');
    console.log('Example: node send-newsletter.js 1');
}

// Check if help is requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showAvailableStories();
    process.exit(0);
}

// Run the newsletter sender
sendWeeklyNewsletter().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});

