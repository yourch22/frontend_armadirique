import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./componentes/Login/Login"
import Registrar from "./componentes/Registrar/Registrar"
import Dashboard from "./componentes/Dashboard/Dashboard"

import DashboardAdmin from "./componentes/Admin/Dashboardadmin"
import DashboardCliente from "./componentes/Client/DashboardCliente"
import Catalogo from "./componentes/Catalogo/Catalogo"
import Inicio from "./componentes/Inicio/Inicio"
import Vista from "./componentes/Vista/Vista"
import Carrito from "./componentes/Carrito/Carrito"
import Contacto from "./componentes/Contacto/Contacto"
import ArmadiqueCheckout from "./componentes/Sistema_Pago/ArmadiqueCheckout" // Agregada extensión .jsx
import ConfirmacionCompra from './componentes/Pedido/ConfirmacionCompra' // Agregada extensión .jsx;
import MisPedidos from "./componentes/MisPedidos/MisPedidos"; // ajusta la ruta



import "./App.css"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Redirigir la raíz a /inicio */}
          <Route path="/" element={<Navigate to="/inicio" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/dashboardadmin" element={<DashboardAdmin />} />
          <Route path="/dashboardcliente" element={<DashboardCliente />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/vista/:id" element={<Vista />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirmacion" element={<ConfirmacionCompra />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          {/* Nueva ruta para el checkout */}
          <Route path="/checkout" element={<ArmadiqueCheckout />} />

          {/* Ruta comodín para rutas inválidas */}
          <Route path="*" element={<Navigate to="/inicio" />} />
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
  )
}

export default App
