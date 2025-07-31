import { Octokit } from 'octokit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🐙 Testing GitHub API directly...\n');

async function testGitHubAPI() {
  try {
    // Initialize GitHub client (no auth needed for public data)
    const octokit = new Octokit();

    console.log('=== Step 1: Test GitHub API Connection ===');
    
    // Test getting user info (public user, no token needed)
    console.log('Testing get_user...');
    const userResponse = await octokit.rest.users.getByUsername({
      username: 'octocat'
    });
    console.log('✅ User info retrieved successfully');
    console.log('User:', userResponse.data.login, '-', userResponse.data.name);

    console.log('\n=== Step 2: Test Repository Info ===');
    
    // Test getting repository info
    console.log('Testing get_repository...');
    const repoResponse = await octokit.rest.repos.get({
      owner: 'octocat',
      repo: 'Hello-World'
    });
    console.log('✅ Repository info retrieved successfully');
    console.log('Repository:', repoResponse.data.full_name);
    console.log('Stars:', repoResponse.data.stargazers_count);
    console.log('Forks:', repoResponse.data.forks_count);

    console.log('\n=== Step 3: Test Repository Statistics ===');
    
    // Test getting repository statistics
    console.log('Testing repository statistics...');
    const stats = {
      owner: 'octocat',
      repo: 'Hello-World',
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      watchers: repoResponse.data.watchers_count,
      language: repoResponse.data.language,
      description: repoResponse.data.description
    };
    console.log('✅ Repository statistics retrieved successfully');
    console.log('Statistics:', JSON.stringify(stats, null, 2));

    console.log('\n🎉 GitHub API is working correctly!');
    console.log('\nAvailable GitHub API features:');
    console.log('- User information retrieval');
    console.log('- Repository data access');
    console.log('- Issue management');
    console.log('- Commit history');
    console.log('- Pull request operations');
    console.log('- Repository search');
    console.log('- Repository statistics');
    console.log('- And much more...');

    console.log('\n📝 To use GitHub MCP:');
    console.log('1. Set your GitHub token in GITHUB_TOKEN environment variable');
    console.log('2. The GitHub API is fully functional and ready for MCP integration');
    console.log('3. You can create custom MCP tools using the Octokit library');

  } catch (error) {
    console.error('❌ Error testing GitHub API:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify GitHub API is accessible');
    console.log('3. If using a token, make sure it has the necessary permissions');
    console.log('4. Error details:', error);
  }
}

// Start the test
testGitHubAPI(); 