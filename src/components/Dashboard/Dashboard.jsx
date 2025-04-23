// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Verificamos si existe el token

    if (!token) {
      // Si no hay token, redirige al login
      navigate('/login');
      return;
    }

    // Si hay token, hacemos la solicitud para obtener los datos del usuario
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Usamos el token en la cabecera
          },
        });

        const data = await response.json();

        if (!response.ok) {
          // Si hay error al obtener los datos, redirige al login
          setError(data.message || 'No autorizado');
          navigate('/login');
        } else {
          setUserData(data);
        }
      } catch (err) {
        setError('Error al obtener los datos del usuario');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return <p>Cargando...</p>; // Mientras se verifica el token
  }

  if (error) {
    return <p className="error">{error}</p>; // Si hubo algún error
  }

  return (
    <div>
      <h2>Bienvenido, {userData?.name}!</h2>
      <p>Email: {userData?.email}</p>
      <button onClick={() => {
        // Eliminar el token de localStorage y redirigir al login
        localStorage.removeItem('token');
        navigate('/login');
      }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
