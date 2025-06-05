// Importaciones necesarias
import React, { useEffect, useState } from "react";
import {
    Container,

    Navbar,
    Nav,
    Offcanvas
} from 'react-bootstrap';
import {
    FaBars,
    FaUser,
    FaSearch,
    FaShoppingCart,

    FaTimes
} from 'react-icons/fa';

import fondoLogo from './logo.png';

// Definición del componente

function Vista() {

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '60px',
            position: 'relative'
        }}>

            {/* Header/Navbar */}
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
                        <Navbar.Brand href="#" style={{
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#333'
                        }}>Armadirique</Navbar.Brand>
                    </div>

                    <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'center' }}>
                        <Nav style={{ margin: '0 auto' }}>
                            <Nav.Link href="/Inicio">Inicio</Nav.Link>
                            <Nav.Link href="/catalogo">Catálogo</Nav.Link>
                            <Nav.Link href="#">Contacto</Nav.Link>
                            <Nav.Link href="#">Nosotros</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <div style={{ display: 'flex' }}>
                        <FaSearch style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
                        <FaShoppingCart style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
                        <FaUser style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
                    </div>
                </Container>
            </Navbar>
            {/* Sidebar/Menú desplegable */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: '250px' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <FaTimes
                            style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                            onClick={() => setShowSidebar(false)}
                        />
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Inicio</Nav.Link>
                        <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Catálogo</Nav.Link>
                        <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Contacto</Nav.Link>
                        <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Nosotros</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* main content*/}
            <main style={{
                padding: '5rem'
            }}>
                    <div style={{ display: 'flex',height:'30rem'}}> 
                        {/* thumbnails*/}
                        <div style={{width:'10%',backgroundColor:'grey'}}></div>
                        {/* imagen*/}
                        <div style={{width:'45%'}}>
                            <img src={fondoLogo} style={{width:'80%',objectFit:'cover'}}alt="" />
                        </div>

                        {/* info*/}
                        <div style={{width:'45%',backgroundColor:'grey'}}>
                            {/* nombre*/}
                            <div style={{margin:'1rem 1rem',fontWeight:'bold'}}>NOMBRE</div>
                            <hr/>
                            {/* descripcion*/}
                            <div style={{margin:'1rem 1rem'}}>
                                <div style={{margin:'1rem 1rem',fontWeight:'bold'}}>Descripcion:</div>
                                <div></div>
                            </div>

                            {/* dimensiones*/}
                            <div style={{margin:'1rem 1rem'}}>
                                <div style={{margin:'1rem 1rem',fontWeight:'bold'}}>Stock:</div>
                                <div></div>
                            </div>
                            {/* precio*/}
                            <div style={{margin:'1rem 1rem'}}>

                            </div>
                            {/* boton*/}
                            <div style={{margin:'1rem 1rem'}}>
                                <button style={{height:'3rem',width:'12rem'}}>ANADIR AL CARRITO</button>
                            </div>
                            {/* estilos*/}
                            <div style={{margin:'1rem 1rem'}}>
                                <div style={{margin:'1rem 1rem',fontWeight:'bold'}}>Estilos:</div>
                                <div></div>
                            </div>
                        </div>

                    </div>

            </main>


        </div>
    );
}

// Exportación del componente
export default Vista;