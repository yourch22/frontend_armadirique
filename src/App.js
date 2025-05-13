import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login/Login';
import Registrar from './componentes/Registrar/Registrar'; // Asegúrate de crear este componente
import Dashboard from './componentes/Dashboard/Dashboard';
import Catalogo from './componentes/Catalogo/Catalogo';
import Inicio from './componentes/Inicio/Inicio';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;