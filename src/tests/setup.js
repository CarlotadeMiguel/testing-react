import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { BroadcastChannel } = require('worker_threads');
global.BroadcastChannel = BroadcastChannel;

import '@testing-library/jest-dom';
import { server } from '../mocks/server'

// Inicia el servidor antes de todos los tests
beforeAll(() => server.listen())

// Restablece handlers entre tests
afterEach(() => server.resetHandlers())

// Cierra el servidor después de los tests
afterAll(() => server.close())