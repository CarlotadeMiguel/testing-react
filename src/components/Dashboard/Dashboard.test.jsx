// src/components/Dashboard/Dashboard.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock de useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockedNavigate = jest.fn();

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
    global.fetch = jest.fn(); // Reinicia el mock de fetch en cada test
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

  test('redirecciona al login si no hay token', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('muestra "Cargando..." mientras se obtiene la data', () => {
    localStorage.setItem('token', 'mock-token');
    renderWithRouter();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('muestra mensaje de error si fetch falla', async () => {
    localStorage.setItem('token', 'mock-token');
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'No autorizado' }),
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/no autorizado/i)).toBeInTheDocument();
    });
  });

  test('muestra datos del usuario si fetch es exitoso', async () => {
    localStorage.setItem('token', 'mock-token');
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        name: 'Juan Pérez',
        email: 'juan@example.com',
      }),
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/juan@example.com/i)).toBeInTheDocument();
    });
  });
});
