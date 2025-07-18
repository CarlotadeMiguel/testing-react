const { spawn } = require('child_process');
const { isServerRunning } = require('./e2e/checkServer');

// Configuration
const SERVER_URL = 'http://127.0.0.1:5173';
const MAX_SERVER_START_ATTEMPTS = 30;
const SERVER_CHECK_INTERVAL = 1000; // 1 second

async function main() {
  console.log('=== E2E Test Runner ===');
  console.log(`Checking if dev server is already running at ${SERVER_URL}...`);
  
  const isRunning = await isServerRunning(SERVER_URL);
  let serverProcess = null;
  
  if (!isRunning) {
    console.log('\n🚀 Starting dev server...');
    serverProcess = spawn('npm', ['run', 'dev'], { 
      stdio: 'inherit',
      shell: true,
      detached: false
    });
    
    // Handle server process errors
    serverProcess.on('error', (err) => {
      console.error('\n❌ Failed to start dev server:', err.message);
      process.exit(1);
    });
    
    // Wait for server to start
    console.log('\n⏳ Waiting for server to start...');
    let attempts = 0;
    let serverStarted = false;
    
    while (attempts < MAX_SERVER_START_ATTEMPTS) {
      attempts++;
      console.log(`Attempt ${attempts}/${MAX_SERVER_START_ATTEMPTS}...`);
      
      await new Promise(resolve => setTimeout(resolve, SERVER_CHECK_INTERVAL));
      const running = await isServerRunning(SERVER_URL);
      
      if (running) {
        console.log('\n✅ Server started successfully!');
        serverStarted = true;
        break;
      }
    }
    
    if (!serverStarted) {
      console.error('\n❌ Server failed to start within the allowed time');
      if (serverProcess) {
        serverProcess.kill();
      }
      process.exit(1);
    }
    
    // Give the server a moment to fully initialize
    console.log('Giving server a moment to stabilize...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  } else {
    console.log('\n✅ Dev server is already running');
  }

  // Determine which test to run
  const testFile = process.argv[2] || 'e2e/chrome.test.js';
  console.log(`\n🧪 Running e2e test: ${testFile}...`);
  const testProcess = spawn('npx', ['jest', testFile, '--no-cache'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle test process completion
  testProcess.on('close', (code) => {
    console.log(`\n${code === 0 ? '✅' : '❌'} Tests finished with code ${code}`);
    
    // Kill server if we started it
    if (serverProcess) {
      console.log('\n🛑 Shutting down dev server...');
      try {
        // On Windows, we need a different approach to kill the process tree
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', serverProcess.pid, '/T', '/F'], { shell: true });
        } else {
          serverProcess.kill('SIGINT');
        }
        console.log('Server shutdown initiated');
      } catch (err) {
        console.error('Error shutting down server:', err.message);
      }
    }
    
    // Give a moment for cleanup before exiting
    setTimeout(() => process.exit(code), 1000);
  });
}

main().catch(err => {
  console.error('\n❌ Unexpected error:', err);
  process.exit(1);
});