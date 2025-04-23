import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Helper para renderizar con router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  test('renderiza correctamente el formulario', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('muestra errores si los campos están vacíos', async () => {
    renderWithRouter(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/el email es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  test('muestra errores la contraseña es invalida', async () => {
    renderWithRouter(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'email@mal.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
    });
  });

  test('login exitoso guarda token y redirige al dashboard', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token-123' }),
      })
    );

    renderWithRouter(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '12345678');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token-123');
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('muestra error si las credenciales son incorrectas', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Credenciales incorrectas' }),
      })
    );

    renderWithRouter(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '12345678');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument();

    global.fetch.mockRestore();
  });

  test('muestra error si falla la red', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

    renderWithRouter(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '12345678');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/error de red/i)).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});
