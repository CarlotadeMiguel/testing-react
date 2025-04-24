import { render, screen, waitFor, act } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import api from '../../api/axios';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

jest.mock('../../api/axios', () => ({
  get: jest.fn(),
}));

const renderWithRouter = (ui = <Dashboard />) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
    jest.resetAllMocks();
    document.body.innerHTML = '';
  });

  test('redirecciona al login si no hay token', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('muestra "Cargando..." mientras se obtiene la data', async () => {
    localStorage.setItem('token', 'mock-token');
    renderWithRouter();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('muestra mensaje de error si la petición falla', async () => {
    localStorage.setItem('token', 'mock-token');
    
    api.get.mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'No autorizado' },
      },
    });

    renderWithRouter();
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('muestra datos del usuario si la petición es exitosa', async () => {
    localStorage.setItem('token', 'mock-token');
    
    // Simulamos que la API devuelve los datos del usuario correctamente
    api.get.mockResolvedValue({
      data: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
      },
    });

    // Usamos act() para envolver el renderizado de forma completa
    await act(async () => {
      renderWithRouter();
    });

    // Esperamos a que los datos del usuario estén en el DOM
    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/juan@example.com/i)).toBeInTheDocument();
    });
  });
});
