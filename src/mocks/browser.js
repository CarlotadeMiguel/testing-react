// src/mocks/browser.js (para entorno navegador)
import { setupWorker } from 'msw'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)