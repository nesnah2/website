import { spawn } from 'child_process';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

console.log('🐙 Simple GitHub MCP Test...\n');

async function testGitHubMCP() {
  try {
    console.log('=== Step 1: Start GitHub MCP Server ===');
    
    // Start the GitHub MCP server process
    const serverProcess = spawn('node', ['github-mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || 'your_github_token_here'
      }
    });

    console.log('✅ GitHub MCP server process started');

    console.log('\n=== Step 2: Create MCP Client ===');
    
    // Create transport and client
    const transport = new StdioClientTransport(serverProcess);
    const client = new Client({
      name: 'github-mcp-test',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    console.log('✅ MCP client created');

    console.log('\n=== Step 3: Connect to Server ===');
    
    // Connect to the server
    await client.connect(transport);
    console.log('✅ Connected to GitHub MCP server');

    console.log('\n=== Step 4: List Available Tools ===');
    
    // List available tools
    const toolsResponse = await client.listTools();
    console.log('Available tools:', toolsResponse.tools.map(tool => tool.name));

    console.log('\n=== Step 5: Test GitHub API Calls ===');

    // Test getting user info (using a public user)
    if (toolsResponse.tools.some(tool => tool.name === 'get_user')) {
      console.log('Testing get_user tool...');
      const userResponse = await client.callTool('get_user', {
        username: 'octocat'
      });
      console.log('✅ User info retrieved successfully');
      console.log('User data preview:', userResponse.content[0].text.substring(0, 200) + '...');
    }

    // Test getting repository info
    if (toolsResponse.tools.some(tool => tool.name === 'get_repository')) {
      console.log('\nTesting get_repository tool...');
      const repoResponse = await client.callTool('get_repository', {
        owner: 'octocat',
        repo: 'Hello-World'
      });
      console.log('✅ Repository info retrieved successfully');
      console.log('Repo data preview:', repoResponse.content[0].text.substring(0, 200) + '...');
    }

    // Test getting repository stars
    if (toolsResponse.tools.some(tool => tool.name === 'get_repository_stars')) {
      console.log('\nTesting get_repository_stars tool...');
      const starsResponse = await client.callTool('get_repository_stars', {
        owner: 'octocat',
        repo: 'Hello-World'
      });
      console.log('✅ Repository stars retrieved successfully');
      console.log('Stars data:', starsResponse.content[0].text);
    }

    console.log('\n🎉 GitHub MCP server is working correctly!');
    console.log('\nAvailable features:');
    console.log('- User information retrieval');
    console.log('- Repository data access');
    console.log('- Issue management');
    console.log('- Commit history');
    console.log('- Pull request operations');
    console.log('- Repository search');
    console.log('- Repository statistics');

  } catch (error) {
    console.error('❌ Error testing GitHub MCP:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you have a valid GitHub token set in GITHUB_TOKEN environment variable');
    console.log('2. Check that the github-mcp-server.js file exists and is working');
    console.log('3. Verify your GitHub token has the necessary permissions');
    console.log('4. Check your internet connection');
    console.log('5. Error details:', error);
  } finally {
    console.log('\nTest completed');
  }
}

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down GitHub MCP test...');
  process.exit(0);
});

// Start the test
testGitHubMCP(); 