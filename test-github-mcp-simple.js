#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'GitHubTestClient',
  version: '1.0.0',
});

(async () => {
  try {
    console.log('🐙 Connecting to GitHub MCP server...');
    
    const transport = new StdioClientTransport('node', ['github-mcp-server.js']);
    await client.connect(transport);
    
    console.log('✅ Connected! Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.tools.map(tool => tool.name));

    console.log('\n=== Testing GitHub API calls ===');

    console.log('\nTesting get_user for octocat...');
    const userResult = await client.callTool({
      name: 'get_user',
      arguments: { 
        username: 'octocat'
      },
    });
    
    console.log('✅ User info retrieved successfully');
    const userData = JSON.parse(userResult.content[0].text);
    console.log('User:', userData.login, '-', userData.name);

    console.log('\nTesting get_repository for octocat/Hello-World...');
    const repoResult = await client.callTool({
      name: 'get_repository',
      arguments: { 
        owner: 'octocat',
        repo: 'Hello-World'
      },
    });
    
    console.log('✅ Repository info retrieved successfully');
    const repoData = JSON.parse(repoResult.content[0].text);
    console.log('Repository:', repoData.full_name);
    console.log('Stars:', repoData.stargazers_count);
    console.log('Forks:', repoData.forks_count);

    console.log('\nTesting get_repository_stars...');
    const starsResult = await client.callTool({
      name: 'get_repository_stars',
      arguments: { 
        owner: 'octocat',
        repo: 'Hello-World'
      },
    });
    
    console.log('✅ Repository stars retrieved successfully');
    const starsData = JSON.parse(starsResult.content[0].text);
    console.log('Stars data:', starsData);

    console.log('\n🎉 GitHub MCP server is working correctly!');
    console.log('\nAvailable features:');
    console.log('- User information retrieval');
    console.log('- Repository data access');
    console.log('- Repository statistics');
    console.log('- Ready for integration with AI assistants');
    
  } catch (err) {
    console.error('❌ Error during GitHub MCP test:', err);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure github-mcp-server.js exists and is executable');
    console.log('2. Check that all dependencies are installed');
    console.log('3. Verify GitHub API is accessible');
  }
})(); 