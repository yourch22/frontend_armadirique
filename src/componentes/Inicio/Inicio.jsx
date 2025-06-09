// Importaciones necesarias
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaTimes
} from 'react-icons/fa';
import slide1 from './slide1.jpg';
import slide2 from './slide2.jpg';
import slide3 from './slide3.jpg';

const images = [
    slide1, slide2, slide3
];

// Definición del componente

function Catalogo() {

    const [showSidebar, setShowSidebar] = useState(false);

    const [index, setIndex] = useState(0);

    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    //Cargar productos desde la api
    const [productos, setProductos] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/productos')
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener productos');
                return response.json();
            })
            .then(data => {
                setProductos(data); // Guardamos el array de productos en el estado
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

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

            {/**********************************carroulsse******************************************************* */}

            <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden' }}>
                <img
                    src={images[index]}
                    alt={`Slide ${index + 1}`}
                    style={{
                        width: '100%',      // o '100%' si quieres que se adapte al contenedor
                        height: 'auto',     // puedes ajustarlo según necesites
                        position: 'absolute',
                        bottom: 0,
                        left: 0,

                    }}
                />

                {/* Botones de navegación */}
                <button
                    onClick={prevSlide}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                >
                    ‹
                </button>

                <button
                    onClick={nextSlide}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                >
                    ›
                </button>
            </div>


            {/*******************Cartas muebles productos****************************************/}
            <div style={{ marginTop: '5vh', marginLeft: '15%', marginRight: '15%', marginBottom: '10%' }}>
                {/**Promociones encabezado */}
                <div>
                    <h6>Destacados</h6>
                    <hr />
                </div>
                {/*Contenedor Cartas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, auto)',
                    gap: '20px',

                }}>
                    {/* carta */}
                    {productos.map((prod) => (
                        <Link to={`/vista/${prod.idProducto}`} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 'inset 0 0 0 1px #c3c3c3',
                                height: '17rem',
                                textAlign: 'center',
                            }}>
                                <div style={{ padding: '5%'}}>{/*Imagen */}
                                    <img src={`./imgMuebles/${prod.imagenUrl}.jpg`} alt={`mueble${prod.idProducto}`}
                                        style={{
                                            
                                            height:'10rem',
                                            objectFit:'cover'
                                        }} />
                                </div>
                                <div style={{ padding: '5%', fontSize: '1rem' }}>{/*Texto */}
                                    <p style={{marginBottom:'0.5rem'}}>{prod.nombre}</p>
                                    <p style={{marginBottom:'0.5rem'}}>S./{prod.precio}</p>

                                </div>



                            </div>
                        </Link>

                    ))}


                </div>


            </div>

            <div style={{ backgroundColor: 'black', height: '300px', color: 'white', display: 'flex', alignItems: 'center' }}>



                <div style={{ flex: 4, textAlign: 'center' }}>

                    <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        Armadirique
                    </div>
                    Siguenos:
                    <FaInstagram style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', margin: '0 0.5rem' }} />
                    <FaFacebookF style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', margin: '0 0.5rem' }} />
                    <FaYoutube style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', margin: '0 0.5rem' }} />


                </div>


                <div style={{ flex: 3 }}>
                    <p><u>Servicio al cliente</u></p>
                    <p>Terminos y condiciones</p>
                    <p>Contacto</p>
                    <p>Comprobante electronico</p>
                </div>
                <div style={{ flex: 3 }}>
                    <p><u>Acerca de:</u></p>
                    <p>Sobre nosotros</p>
                    <p>Proceso de diseno</p>
                    <p>Estudio</p>
                </div>

            </div>

        </div>

    );
}

// Exportación del componente
export default Catalogo;