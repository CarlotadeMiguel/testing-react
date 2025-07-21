const http = require('http');
const https = require('https');

/**
 * Checks if a server is running at the specified URL
 * @param {string} url - URL to check (e.g., 'http://127.0.0.1:5173')
 * @returns {Promise<boolean>} - Promise resolving to true if server is running
 */
function isServerRunning(url) {
  return new Promise((resolve) => {
    try {
      console.log(`Checking if server is running at ${url}...`);
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname || '/',
        method: 'HEAD',
        timeout: 3000
      };

      const req = protocol.request(options, (res) => {
        console.log(`Server responded with status code: ${res.statusCode}`);
        // Consider any response as a sign the server is running
        resolve(true);
      });

      req.on('error', (err) => {
        console.log(`Server check error: ${err.message}`);
        resolve(false);
      });

      req.on('timeout', () => {
        console.log('Server check timed out');
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (err) {
      console.log(`Unexpected error checking server: ${err.message}`);
      resolve(false);
    }
  });
}

module.exports = { isServerRunning };