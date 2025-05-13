// Importaciones necesarias
import React, { useState } from 'react';
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
    Offcanvas
} from 'react-bootstrap';
import {
    FaBars,
    FaUser,
    FaSearch,
    FaShoppingCart,
    FaFacebook,
    FaGoogle,
    FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import fondoLogo from './logo.png';
import { left } from '@popperjs/core';

const productos = [
    { id: 1, nombre: 'Silla Madera Azul', descripcion: 'Descripción A', precio: 's/ 800.00',url:'mueble1' },
    { id: 2, nombre: 'Sillon Rojo', descripcion: 'Descripción A', precio: 's/ 600.00',url:'mueble2' },
    { id: 3, nombre: 'Silla Blanca', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble3' },
    { id: 4, nombre: 'Sofa Marron', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble4' },
    { id: 5, nombre: 'Sillon Plomo', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble5' },
    { id: 6, nombre: 'Silla Amoblada', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble6' },
    { id: 7, nombre: 'Sofa Gris', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble7' },
    { id: 8, nombre: 'Silla Verde Giratoria', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble8' },
    { id: 9, nombre: 'Sofa Azul', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble9' },
    { id: 10, nombre: 'Banco Madera', descripcion: 'Descripción A', precio: 's/ 1000.00',url:'mueble10' },
];


// Definición del componente

function Catalogo() {

    const [showSidebar, setShowSidebar] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    const [isHoveredButton, setIsHoveredButton] = useState(null);
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

            {/*Cuerpo principal de la pagina */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'stretch', // 🔑 esto es clave
                    minHeight: '100vh',
                    backgroundColor: '#f3f3f3',
                }}>
                {/* Columna Izquierda */}
                <div
                    style={{
                        width: '15%',
                        backgroundColor: '#ddd',
                        display: 'flex',
                        //alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '15vh',
                        boxSizing: 'border-box',
                        //alignItems:'center'
                        
                    }}>



                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'2vh',
                        fontWeight:'300',
                    }}
                    >
                        <p>Precio</p>
                        <p>Tipo</p>
                        <p>Envio</p>
                        <p>Descuento</p>

                    </div>

                </div>

                {/* Columna Central(Catalogo) */}
                <div
                    style={{
                        width: '70%',
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}>
                    {/*Titulo*/}
                    <div style={{margin:'5px 0'}}>
                        <h6>Catalogo</h6>
                        Resultados: {productos.length}
                    </div>
                    {/*Prodcutos*/}
                    {productos.map((prod) => (
                               
                            <div
                                key={prod.id}
                                style={{
                                    backgroundColor: '#fff',
                                    margin: '10px 0',
                                    padding: '30px 15px',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    transition: '0.3s ease',
                                    display:'flex',
                                    width: '100%',
                                    //height:'25%',
                                    alignItems: 'center'
                                }}>
                                    
                                {/*Imagen*/} 
                                <div>
                                    <Link to="#"> 
                                        <img src={`./imgMuebles/mueble${prod.id}.jpg`}  alt={`mueble${prod.id}`} 
                                        style={{width:'20vh',marginRight:'4vh'}}></img>
                                    </Link>  
                                </div>
                                {/*Nombre y descripcion*/}    
                                <div style={{ flex: 1 }}>
                                    <Link key={prod.id} to="#" 
                                    style={{
                                        textDecoration:'none',
                                        color: isHovered===prod.id ? '#f7ad02' : 'black', // Cambia el fondo cuando se pasa el mouse
                                        transition: '0.1s', // Transición suave
                                    }}
                                    onMouseEnter={() => setIsHovered(prod.id)}
                                    onMouseLeave={() => setIsHovered(null)}  
                                    >
                                    <h6>{prod.nombre}</h6>
                                    </Link>

                                    <p>{prod.descripcion}</p>
                                </div>
                                {/*Precio y agregar carrito*/}   
                                <div style={{display:'flex',flexDirection:'column',textAlign:'end'}}>

                                    <h6 style={{marginBottom: '7vh'}}>{prod.precio}</h6>

                                    <button key={prod.id} style={{
                                        fontSize:'1.7vh',
                                        color:isHoveredButton==prod.id?'black':'white',
                                        backgroundColor:isHoveredButton==prod.id?'white':'black',
                                        transition:'0.2s',
                                        borderRadius: '10px',
                                        padding:'1vh'
                                    }}
                                    onMouseEnter={() => setIsHoveredButton(prod.id)}
                                    onMouseLeave={() => setIsHoveredButton(null)} 
                                    >Agregar al carrito</button>
                                </div> 
                               
                            </div> 
                            
                    ))}
                </div>

                {/* Columna Derecha */}
                <div
                    style={{
                        width: '15%',
                        backgroundColor: '#ddd',
                        display: 'flex',
                        //alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}>
                    Barra Derecha
                </div>
            </div>


        </div>
    );
}

// Exportación del componente
export default Catalogo;