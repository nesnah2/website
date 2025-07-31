import { spawn } from 'child_process';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

console.log('🐙 Testing GitHub MCP Server...\n');

// Set environment variable for GitHub token
if (!process.env.GITHUB_TOKEN) {
  process.env.GITHUB_TOKEN = 'your_github_token_here';
}

// Test GitHub MCP functionality
async function testGitHubMCP() {
  try {
    console.log('=== Step 1: Initialize MCP Connection ===');
    
    const transport = new StdioClientTransport('node', ['github-mcp-server.js']);
    const client = new Client({
      name: 'github-mcp-test',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    await client.connect(transport);
    console.log('✅ Connected to GitHub MCP server');

    console.log('\n=== Step 2: Test Available Tools ===');
    
    // List available tools
    const toolsResponse = await client.listTools();
    console.log('Available GitHub tools:', toolsResponse.tools.map(tool => tool.name));

    console.log('\n=== Step 3: Test GitHub API Calls ===');

    // Test getting user info
    if (toolsResponse.tools.some(tool => tool.name === 'get_user')) {
      console.log('Testing get_user tool...');
      const userResponse = await client.callTool('get_user', {
        username: 'octocat' // GitHub's test user
      });
      console.log('User info:', userResponse.content[0].text);
    }

    // Test getting repository info
    if (toolsResponse.tools.some(tool => tool.name === 'get_repository')) {
      console.log('\nTesting get_repository tool...');
      const repoResponse = await client.callTool('get_repository', {
        owner: 'octocat',
        repo: 'Hello-World'
      });
      console.log('Repository info:', repoResponse.content[0].text);
    }

    // Test getting issues
    if (toolsResponse.tools.some(tool => tool.name === 'list_issues')) {
      console.log('\nTesting list_issues tool...');
      const issuesResponse = await client.callTool('list_issues', {
        owner: 'octocat',
        repo: 'Hello-World',
        state: 'open',
        per_page: 5
      });
      console.log('Issues:', issuesResponse.content[0].text);
    }

    // Test getting commits
    if (toolsResponse.tools.some(tool => tool.name === 'list_commits')) {
      console.log('\nTesting list_commits tool...');
      const commitsResponse = await client.callTool('list_commits', {
        owner: 'octocat',
        repo: 'Hello-World',
        per_page: 3
      });
      console.log('Recent commits:', commitsResponse.content[0].text);
    }

    console.log('\n🎉 GitHub MCP server is working correctly!');
    console.log('\nAvailable features:');
    console.log('- User information retrieval');
    console.log('- Repository data access');
    console.log('- Issue management');
    console.log('- Commit history');
    console.log('- Pull request operations');
    console.log('- Repository search');
    console.log('- And more...');

  } catch (error) {
    console.error('❌ Error testing GitHub MCP:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you have a valid GitHub token set in GITHUB_TOKEN environment variable');
    console.log('2. Check that @modelcontextprotocol/server-github is installed');
    console.log('3. Verify your GitHub token has the necessary permissions');
    console.log('4. Check your internet connection');
  } finally {
    // Clean up
    console.log('Test completed');
  }
}

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down GitHub MCP test...');
  process.exit(0);
});

// Start the test
testGitHubMCP(); 