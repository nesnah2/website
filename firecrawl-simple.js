#!/usr/bin/env node
import fetch from 'node-fetch';

// Your Firecrawl API key
const API_KEY = 'fc-e9a33be0d8a04738b894154361d70b34';
const API_URL = 'https://api.firecrawl.dev/v1/scrape';

async function crawlWebsite(url) {
    try {
        console.log(`🌐 Crawling: ${url}`);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                skipTlsVerification: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Crawl successful!');
        console.log('📄 Content length:', data.data?.content?.length || 'No content');
        console.log('🔗 URL:', data.data?.url || url);
        
        return data;
    } catch (error) {
        console.error('❌ Error crawling website:', error.message);
        throw error;
    }
}

// Test the crawler
async function main() {
    try {
        const result = await crawlWebsite('https://mikkelhansen.org');
        console.log('\n📊 Crawl Result:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Failed to crawl:', error.message);
    }
}

main(); 