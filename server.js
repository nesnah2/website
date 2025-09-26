const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
// const { addWorkbookSubscriber } = require('./workbook-automation.js');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

// Simple in-memory storage for subscribers
let subscribers = [];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Handle API endpoints
    if (pathname === '/api/subscribe' && req.method === 'POST') {
        handleSubscribe(req, res);
        return;
    }
    
    if (pathname === '/api/subscribers' && req.method === 'GET') {
        handleGetSubscribers(req, res);
        return;
    }
    
    // Handle static files
    let filePath = '.' + req.url;
    
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'text/plain';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Handle email subscription
function handleSubscribe(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const { firstName, email, source } = data;
            
            // Validate required fields
            if (!firstName || !email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'First name and email are required' }));
                return;
            }
            
            // Validate email format
            if (!emailRegex.test(email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Please enter a valid email address' }));
                return;
            }
            
            // Check if email already exists
            const existingSubscriber = subscribers.find(sub => sub.email === email);
            if (existingSubscriber) {
                // Update existing subscriber
                existingSubscriber.firstName = firstName;
                existingSubscriber.source = source || 'workbook_download';
                existingSubscriber.updatedAt = new Date();
            } else {
                // Add new subscriber
                subscribers.push({
                    firstName,
                    email,
                    source: source || 'workbook_download',
                    subscribedAt: new Date(),
                    updatedAt: new Date()
                });
            }
            
            console.log('New workbook subscriber:', { firstName, email, source });
            
            // Add to MailerLite and send welcome email (disabled for now)
            // const automationResult = await addWorkbookSubscriber(firstName, email, source);
            
            // For now, just return success
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Subscription successful' 
            }));
            
        } catch (error) {
            console.error('Subscription error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Something went wrong. Please try again.' }));
        }
    });
}

// Handle get subscribers (for admin)
function handleGetSubscribers(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        count: subscribers.length,
        subscribers: subscribers.map(sub => ({
            firstName: sub.firstName,
            email: sub.email,
            source: sub.source,
            subscribedAt: sub.subscribedAt
        }))
    }));
}

server.listen(PORT, () => {
    console.log('🚀 Server is running!');
    console.log('📱 Your professional mentoring website is now available at:');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('✨ Features:');
    console.log('   - Modern, responsive design');
    console.log('   - Professional mentoring content');
    console.log('   - Contact form functionality');
    console.log('   - Mobile-friendly navigation');
    console.log('');
    console.log('🛑 To stop the server, press Ctrl+C');
    console.log('='.repeat(50));
});

