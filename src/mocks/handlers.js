// src/mocks/handlers.js
import { http } from 'msw';

const users = [
  { email: 'test@test.com', password: '12345678', name: 'Usuario Test' }
];

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return Response.json({
        token: 'fake-token-123',
        user: { email: user.email, name: user.name }
      }, { status: 200 });
    }

    return Response.json({ message: 'Credenciales incorrectas' }, { status: 401 });
  }),

  http.get('/api/profile', ({ request }) => {
    const token = request.headers.get('Authorization');

    if (token === 'Bearer fake-token-123') {
      return Response.json({
        email: 'test@test.com',
        name: 'Usuario Test'
      }, { status: 200 });
    }

    return Response.json({ message: 'No autorizado' }, { status: 401 });
  })
];

import { server } from '../mocks/server'

beforeAll(() => server.listen({
  onUnhandledRequest: (req) => {
    // Ignora peticiones de WebDriver (Selenium)
    if (req.url.toString().includes('127.0.0.1') || req.url.toString().includes('localhost')) {
      return;
    }
    // Log otros requests no manejados
    console.warn('Found an unhandled %s request to %s', req.method, req.url);
  }
}));