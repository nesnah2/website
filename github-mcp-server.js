#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Create MCP server
const server = new Server(
  {
    name: 'github-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define GitHub tools
const tools = [
  {
    name: 'get_user',
    description: 'Get information about a GitHub user',
    inputSchema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'The GitHub username to get information for',
        },
      },
      required: ['username'],
    },
  },
  {
    name: 'get_repository',
    description: 'Get information about a GitHub repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The repository owner (username or organization)',
        },
        repo: {
          type: 'string',
          description: 'The repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'get_repository_stars',
    description: 'Get the number of stars for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The repository owner',
        },
        repo: {
          type: 'string',
          description: 'The repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
];

// Set up tool handlers
server.setRequestHandler('tools/list', async () => {
  return {
    tools: tools,
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_user':
        const { username } = args;
        const userResponse = await octokit.rest.users.getByUsername({
          username: username,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(userResponse.data, null, 2),
            },
          ],
        };

      case 'get_repository':
        const { owner, repo } = args;
        const repoResponse = await octokit.rest.repos.get({
          owner: owner,
          repo: repo,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(repoResponse.data, null, 2),
            },
          ],
        };

      case 'get_repository_stars':
        const starsResponse = await octokit.rest.repos.get({
          owner: args.owner,
          repo: args.repo,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                owner: args.owner,
                repo: args.repo,
                stars: starsResponse.data.stargazers_count,
                forks: starsResponse.data.forks_count,
                watchers: starsResponse.data.watchers_count,
              }, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Error in tool ${name}:`, error);
    throw new Error(`GitHub API error: ${error.message}`);
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

console.error('GitHub MCP server started'); 