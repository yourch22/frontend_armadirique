import React, { useState } from "react";
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

function NavbarCliente(){
const [showSidebar, setShowSidebar] = useState(false);
const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


    return(
        <>
            {/* Cabecera de las vistas de cliente */}
                    <Navbar bg="light" expand="lg" style={{
                        backgroundColor: '#fff !important',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        position: 'fixed',
                        top: 0,
                        width: '100%',
                        zIndex: 1000
                    }}>
                        <Container fluid>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaBars
                                    style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#333', marginRight: '1rem' }}
                                    onClick={() => setShowSidebar(true)}
                                />
                                <Navbar.Brand href="/inicio" style={{
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    color: '#333'
                                }}>Armadirique</Navbar.Brand>
                            </div>
        
                            <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'center' }}>
                                <Nav style={{ margin: '0 auto' }}>
                                    <Nav.Link href="/inicio">Inicio</Nav.Link>
                                    <Nav.Link href="/catalogo">Catálogo</Nav.Link>
                                    <Nav.Link href="/contacto">Nosotros/Contacto</Nav.Link>
                                    <Nav.Link href="">Realizar Pago</Nav.Link>

                                </Nav>
                            </Navbar.Collapse>
        
                            <div style={{ display: 'flex' }}>
                                <FaSearch style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
                                <FaShoppingCart style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
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
                                                <Dropdown.Item onClick={handleLogout}>
                                                  Iniciar/Cerrar sesión
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                            </div>
                        </Container>
                    </Navbar>
                    {/* Sidebar/Menú desplegable */}
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: '250px' }}>
                        <Offcanvas.Header>
                            <Offcanvas.Title>
                                <FaTimes
                                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                    onClick={() => setShowSidebar(false)}
                                />
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column">
                                <Nav.Link href="/inicio" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Inicio</Nav.Link>
                                <Nav.Link href="/catalogo" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Catálogo</Nav.Link>
                                <Nav.Link href="/contacto" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Nosotros/Contacto</Nav.Link>
                                <Nav.Link onClick={() => window.open("https://wa.me/+51913378799", "_blank")} style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Contactanos por WhatsApp</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
        </>
    )
}


export default NavbarCliente