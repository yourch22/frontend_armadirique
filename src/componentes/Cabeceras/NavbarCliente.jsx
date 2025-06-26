import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Navbar,
  Nav,
  FormCheck,
  Offcanvas,
  Dropdown,
} from "react-bootstrap";
import {
  FaBars,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaFacebook,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { left } from "@popperjs/core";

import Carrito from "../Carrito/Carrito";
import { useCarrito } from "../../context/CarritoContext";

function NavbarCliente() {
  const { logout } = useAuth(); // <-- usamos el contexto
  const isLoggedIn = !!localStorage.getItem("token");

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const handleLogout = () => {

    if (!isLoggedIn){
      navigate("/login");
      return;
    }
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // <-- limpia el contexto y localStorage
        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "Has salido exitosamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    });
  };
  //Variable para el Carrito
  const { carrito } = useCarrito();
  const totalItems = carrito?.items?.length || 0;
  const [carritoVisible, setCarritoVisible] = useState(false);
  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  return (
    <>
      {/* Cabecera de las vistas de cliente */}
      <Navbar
        bg="light"
        expand="lg"
        style={{
          backgroundColor: "#fff !important",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        {/*El componente Carrito ira dentro del componente NavbarCliente*/}
        <Carrito
          carritoVisible={carritoVisible}
          toggleCarrito={toggleCarrito}
        />
        {/*##############################################################*/}
        <Container fluid>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaBars
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#333",
                marginRight: "1rem",
              }}
              onClick={() => setShowSidebar(true)}
            />
            <Navbar.Brand
              href="/inicio"
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#333",
              }}
            >
              Armadirique
            </Navbar.Brand>
          </div>

          <Navbar.Collapse
            id="basic-navbar-nav"
            style={{ justifyContent: "center" }}
          >
            <Nav style={{ margin: "0 auto" }}>
              <Nav.Link href="/inicio">Inicio</Nav.Link>
              <Nav.Link href="/catalogo">Catálogo</Nav.Link>
              <Nav.Link href="/contacto">Nosotros/Contacto</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <div style={{ display: "flex" }}>
            <FaSearch
              style={{
                fontSize: "1.2rem",
                color: "#333",
                cursor: "pointer",
                margin: "0 1rem",
              }}
            />
            <FaShoppingCart
              style={{
                fontSize: "1.2rem",
                color: "#333",
                cursor: "pointer",
                margin: "0 1rem",
              }}
              onClick={toggleCarrito}
            />
            {totalItems > 0 && <span className="">{totalItems}</span>}

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  padding: 0,
                  boxShadow: "none",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUser style={{ fontSize: "1.2rem", margin: "0 1rem" }} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
                <Dropdown.Divider />

                {/* Mostrar solo si está logeado */}
                {isLoggedIn && (
                  <>
                    <Dropdown.Item href="/mis-pedidos">
                      Mis Pedidos
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                )}

                <Dropdown.Item onClick={handleLogout}>
                  {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>
      {/* Sidebar/Menú desplegable */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        style={{ width: "250px" }}
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <FaTimes
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setShowSidebar(false)}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              href="/inicio"
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Inicio
            </Nav.Link>
            <Nav.Link
              href="/catalogo"
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Catálogo
            </Nav.Link>
            <Nav.Link
              href="/contacto"
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Nosotros/Contacto
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                window.open("https://wa.me/+51913378799", "_blank")
              }
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Contactanos por WhatsApp
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavbarCliente;
