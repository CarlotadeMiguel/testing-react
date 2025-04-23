// src/mocks/server.js (para entorno Node.js/Jest)
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)