import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './Dashboard.css';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('/profile');
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Error de red');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido al Dashboard</h1>
      </div>
      <div className="dashboard-content">
        {userData && (
          <div className="dashboard-user-info">
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;