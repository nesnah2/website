const FirecrawlApp = require("@mendable/firecrawl-js").default;
require("dotenv").config();

async function exampleCrawl() {
  try {
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });

    console.log("🌐 Starting example crawl...");
    
    // Example: Crawl a simple website
    const result = await firecrawl.scrapeUrl("https://example.com", {
      pageOptions: {
        waitFor: 2000, // Wait 2 seconds for page to load
      },
      scrapeOptions: {
        includeHtml: true,
        includeMarkdown: true,
      },
    });

    console.log("✅ Crawl completed successfully!");
    console.log("📄 Page title:", result.data.title);
    console.log("📝 Content length:", result.data.markdown?.length || 0, "characters");
    console.log("🔗 URL:", result.data.url);
    
  } catch (error) {
    console.error("❌ Error during crawl:", error.message);
  }
}

// Run the example
exampleCrawl(); 