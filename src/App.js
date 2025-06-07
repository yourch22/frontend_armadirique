import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login/Login';
import Registrar from './componentes/Registrar/Registrar';
import Dashboard from './componentes/Dashboard/Dashboard';

import DashboardAdmin from './componentes/Admin/Dashboardadmin';
import DashboardCliente from './componentes/Client/DashboardCliente';
import Catalogo from './componentes/Catalogo/Catalogo';
import Inicio from './componentes/Inicio/Inicio';


import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
           // <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            <Route path="/dashboardcliente" element={<DashboardCliente />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/inicio" element={<Inicio />} />
  
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>

      {/* Contenedor global de notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
