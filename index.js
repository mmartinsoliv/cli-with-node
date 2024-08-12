#!/usr/bin/env node

import { program } from "commander";
import fetch from "node-fetch"; // Import node-fetch

const GITHUB_API_URL = 'https://api.github.com'

const fetchEventsFromGithub = async (username) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/users/${username}/events`);

    if (!response.ok) {
      throw new Error(`Failed to fetch events for user: ${username}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log('No events found for this user.');
      return;
    }

    const repoName = data[0].repo.name;
    const repoURL = data[0].repo.url;

    console.log('Repository name:', repoName);
    console.log('Repository URL:', repoURL);

    const commits = data[0].payload.commits;

    if (commits && commits.length > 0) {
      console.log('The last commit message:', commits[0].message);
    } else {
      console.log('No commits found for this event.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

program
  .version("1.0.0")
  .description("GitHub User Activity")
  .option("-n, --username <type>", "GitHub username")
  .action((options) => {
    if (options.username) {
      fetchEventsFromGithub(options.username);
    } else {
      console.error("Please provide a GitHub username with -n or --username option.");
    }
  });

program.parse(process.argv);
