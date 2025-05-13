import React, { useEffect, useState } from 'react';

const DashboardAdmin = () => {
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
        setUsuario(data);

        // Aquí podrías usar data.authorities[0].authority si necesitas el rol
        console.log('Usuario actual:', data); // ✅ Aquí lo ves en consola
        console.log('Token:', token); // ✅ Aquí lo ves en consola
         console.log('Rol:', data.authorities[0].authority); // ✅ Aquí lo ves en consola rol del usuario actual
        const rol = data.authorities[0]?.authority;
        console.log('ROL DEL USUARIO:', rol);

        if (rol !== 'ADMIN') {
          // Redirige si no es admin
          window.location.href = '/dashboardcliente';
        }

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
      <h1>Bienvenido al Dashboard Admin</h1>
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

export default DashboardAdmin;
