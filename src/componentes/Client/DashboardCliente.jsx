import React, { useEffect, useState } from 'react';

const DashboardCliente = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:8080/actual-usuario', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el usuario');
        }

        const data = await response.json();
        const rol = data.authorities[0]?.authority;

        // ✅ Si el usuario es ADMIN, lo redirigimos al dashboard admin
        if (rol === 'ADMIN') {
          window.location.href = '/dashboardadmin';
          return;
        }

        setUsuario(data);
        console.log('Usuario actual:', data);

      } catch (error) {
        console.error(error);
        setError('Error al obtener el usuario');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bienvenido al Dashboard Cliente</h1>
      {usuario ? (
        <>
          <p>Sesión iniciada como: <strong>{usuario.nombre} {usuario.apellidos}</strong></p>
          <p>Rol: <strong>{usuario.authorities[0]?.authority}</strong></p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default DashboardCliente;
