import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login/Login';
import Registrar from './componentes/Registrar/Registrar';
import Dashboard from './componentes/Dashboard/Dashboard';
<<<<<<< HEAD
<<<<<<< HEAD
import DashboardAdmin from './componentes/GestionAdministrador/DashboardAdmin'
import GestionProducto from './componentes/GestionAdministrador/GestionProducto'
import './App.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/gproductos" element={<GestionProducto />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
=======
import DashboardAdmin from './componentes/Admin/Dashboardadmin';
import DashboardCliente from './componentes/Client/DashboardCliente';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
=======

import DashboardAdmin from './componentes/Admin/Dashboardadmin';
import DashboardCliente from './componentes/Client/DashboardCliente';
import Catalogo from './componentes/Catalogo/Catalogo';
import Inicio from './componentes/Inicio/Inicio';


import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
>>>>>>> origin/main
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
<<<<<<< HEAD
            <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            <Route path="/dashboardcliente" element={<DashboardCliente />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
=======
           // <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            <Route path="/dashboardcliente" element={<DashboardCliente />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/inicio" element={<Inicio />} />
  
>>>>>>> origin/main
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
<<<<<<< HEAD
>>>>>>> 6ad107cbd3ea681d7a3bb1dbcc64a7a2d3f10636
=======
>>>>>>> origin/main
  );
}

export default App;
