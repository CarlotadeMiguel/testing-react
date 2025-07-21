const { spawn, exec } = require('child_process');
const http = require('http');
const https = require('https');

function isServerRunning(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: '/',
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

async function runE2ETests(testFile) {
  const SERVER_URL = 'http://localhost:5173';
  let serverProcess = null;
  
  try {
    // Verificar si el servidor ya está corriendo
    console.log(`Verificando si el servidor está corriendo en ${SERVER_URL}...`);
    const isRunning = await isServerRunning(SERVER_URL);
    
    if (!isRunning) {
      console.log('Iniciando servidor Vite...');
      serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      // Esperar a que el servidor esté listo
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (await isServerRunning(SERVER_URL)) {
          console.log('✅ Servidor Vite está listo');
          break;
        }
        
        attempts++;
        console.log(`Esperando servidor... Intento ${attempts}/${maxAttempts}`);
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('El servidor no arrancó en el tiempo esperado');
      }
    } else {
      console.log('✅ Servidor ya está corriendo');
    }
    
    // Ejecutar tests E2E
    console.log(`Ejecutando test E2E: ${testFile}`);
    const testProcess = spawn('npx', ['jest', testFile], {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('close', (code) => {
      if (serverProcess) {
        console.log('Cerrando servidor...');
        // Terminar servidor en Windows y Linux
        if (process.platform === 'win32') {
          exec(`taskkill /pid ${serverProcess.pid} /T /F`);
        } else {
          serverProcess.kill('SIGTERM');
        }
      }
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Error:', error);
    if (serverProcess) {
      if (process.platform === 'win32') {
        exec(`taskkill /pid ${serverProcess.pid} /T /F`);
      } else {
        serverProcess.kill('SIGTERM');
      }
    }
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
const testFile = process.argv[2];
if (!testFile) {
  console.error('Uso: node run-e2e-tests.js <archivo-de-test>');
  process.exit(1);
}

runE2ETests(testFile);
