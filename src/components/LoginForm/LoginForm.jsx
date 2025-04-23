import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogingForm.css';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!email) validationErrors.email = 'El email es obligatorio';
    else if (!validateEmail(email)) validationErrors.email = 'Email inválido';

    if (!password) validationErrors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(password)) validationErrors.password = 'Debe tener al menos 8 caracteres';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || 'Error en el login' });
      } else {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ general: 'Error de red' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>

      {errors.general && <p className="error">{errors.general}</p>}

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}