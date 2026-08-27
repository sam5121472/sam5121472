require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
const githubService = require('./services/github.service');

const GITHUB_USERNAME = 'sam5121472';
const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'UTC',
  }),
};

async function setGithubStats() {
  const stats = await githubService.getPublicProfileStats(GITHUB_USERNAME);
  DATA.public_repos = stats.public_repos;
  DATA.followers = stats.followers;
}

async function generateReadMe() {
  const template = fs.readFileSync(MUSTACHE_MAIN_DIR, 'utf8');
  const output = Mustache.render(template, DATA);
  fs.writeFileSync('README.md', output);
}

async function build() {
  /**
   * Pull live public stats (repos, followers) from the GitHub API.
   */
  await setGithubStats();

  /**
   * Render main.mustache -> README.md
   */
  await generateReadMe();

  console.log('README.md regenerated at', DATA.refresh_date);
}

build();
