import { useState } from 'react';

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
        console.log('✅ Login exitoso:', data);
      }
    } catch (err) {
      setErrors({ general: 'Error de red' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Iniciar Sesión</h2>

      {errors.general && <p className="error">{errors.general}</p>}

      <div>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Contraseña:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button type="submit" disabled={isLoading} style={{ marginTop: '20px' }}>
        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
