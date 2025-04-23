// jest.polyfills.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Añade otras APIs del navegador si es necesario
global.Request = require('node-fetch').Request;
global.Response = require('node-fetch').Response;