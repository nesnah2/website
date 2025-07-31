import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'AnalyzeClient',
  version: '1.0.0',
});

const transport = new StdioClientTransport(
  'C:\\Program Files\\nodejs\\npx.cmd',
  ['@mseep/firecrawl-mcp'],
  { env: { ...process.env } }
);

(async () => {
  try {
    await client.connect(transport);
    const result = await client.callTool({
      name: 'crawl_website',
      arguments: { url: 'https://annedamgaard.com' },
    });
    console.log('Crawl result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error during MCP analysis:', err);
  }
})(); 