import React, { useEffect, useState } from 'react';

const GestionUsuario = () => {

  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub);
    } catch {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bienvenido a Mantenimiento</h1>
      <p>Sesión iniciada como: <strong>{username}</strong></p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
    
  );
};

export default GestionUsuario;
    </>
  );
}
