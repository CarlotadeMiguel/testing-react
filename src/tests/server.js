// src/test/server.js (para entorno Node.js/Jest)
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'

export const server = setupServer(...handlers)