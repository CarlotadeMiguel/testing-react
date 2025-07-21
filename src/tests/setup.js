import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { BroadcastChannel } = require('worker_threads');
global.BroadcastChannel = BroadcastChannel;

import '@testing-library/jest-dom';
import { server } from './server'

// Configuración MSW que ignora peticiones de Selenium
beforeAll(() => server.listen({
  onUnhandledRequest: (req) => {
    // Ignora peticiones de WebDriver/Selenium (127.0.0.1 o localhost en puertos altos)
    const url = req.url.toString();
    if (url.includes('127.0.0.1') || url.includes('localhost:') && /:\d{4,5}\//.test(url)) {
      return; // Silencia peticiones de Selenium
    }
    // Log otros requests no manejados
    console.warn('Found an unhandled %s request to %s', req.method, req.url);
  }
}))

// Restablece handlers entre tests
afterEach(() => server.resetHandlers())

// Cierra el servidor después de los tests
afterAll(() => server.close())
