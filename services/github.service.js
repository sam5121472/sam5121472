const fetch = require('node-fetch');

const GITHUB_API = 'https://api.github.com';

class GithubService {
  /**
   * Pulls basic public profile stats for a user via the public GitHub API.
   * Uses an optional token (GITHUB_TOKEN) only to raise the rate limit —
   * no private data is requested and no scraping is performed.
   *
   * @param {string} username
   */
  async getPublicProfileStats(username) {
    const headers = { 'User-Agent': `${username}-readme-bot` };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
      const res = await fetch(`${GITHUB_API}/users/${username}`, { headers });
      if (!res.ok) {
        throw new Error(`GitHub API responded with ${res.status}`);
      }
      const data = await res.json();

      return {
        public_repos: data.public_repos ?? 0,
        followers: data.followers ?? 0,
      };
    } catch (error) {
      console.log('GithubService error, falling back to safe defaults:', error.message);
      // Never let a failed API call break the README build.
      return { public_repos: 0, followers: 0 };
    }
  }
}

module.exports = new GithubService();
