const FirecrawlApp = require("@mendable/firecrawl-js").default;
require("dotenv").config();

async function testFirecrawl() {
  try {
    // Check if API key is set
    if (!process.env.FIRECRAWL_API_KEY) {
      console.log("❌ FIRECRAWL_API_KEY not found in environment variables");
      console.log("Please create a .env file with your Firecrawl API key");
      return;
    }

    console.log("✅ FIRECRAWL_API_KEY found");
    
    // Initialize Firecrawl
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });

    console.log("✅ Firecrawl initialized successfully");
    console.log("🎉 Firecrawl MCP server is ready to use!");
    
  } catch (error) {
    console.error("❌ Error testing Firecrawl:", error.message);
  }
}

testFirecrawl(); 