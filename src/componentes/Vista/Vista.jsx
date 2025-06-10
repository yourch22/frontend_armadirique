// Importaciones necesarias
import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
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

// Definición del componente

function Vista() {

    const [showSidebar, setShowSidebar] = useState(false);

    const {id} = useParams();
    const [producto, setProducto] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/productos/${id}`)
        .then((res) => res.json())
        .then((data) => setProducto(data));
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [id]);


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
                padding: '4rem 8rem'
            }}>
                    <div style={{ 
                        display: 'flex',
                        height:'35rem',
                        padding:'1rem',
                        //border:'1px solid black',
                        boxShadow: 'inset 0 0 0 1px #c3c3c3',
                        borderRadius:'1rem'
                        }}> 
                        {/* imagen*/}
                        <div style={{width:'50%',alignSelf:'center'}}>
                            <img src={`/imgMuebles/${producto.imagenUrl}.jpg`} style={{width:'30rem',objectFit:'cover'}}alt="" />
                        </div>

                        {/* info*/}
                        <div style={{width:'50%',margin:'0rem 2rem'}}>
                            {/* nombre*/}
                            <div style={{fontWeight:'bold',fontSize:'1.3rem',margin:'1rem 0rem'}}>
                                {producto.nombre}
                            </div>
                            <hr/>
                            {/* descripcion*/}
                            <div style={{margin:'2rem 0rem'}}>
                                <div style={{fontWeight:'bold'}}>Descripcion:</div>
                                <div style={{}}>{producto.descripcion}</div>
                            </div>
                            {/* estilos*/}
                            <div style={{margin:'2rem 0rem'}}>
                                <div style={{fontWeight:'bold'}}>Estilos:</div>
                                <div></div>
                            </div >
                            {/* precio*/}
                            <div style={{margin:'2rem 2rem',textAlign:'right'}}>
                                <div style={{fontWeight:'bold',fontSize:'2rem'}}>S./{producto.precio}</div>
                            </div>
                            {/* boton*/}
                            <div style={{margin:'1rem 2rem',textAlign:'right'}}>
                                <button style={{height:'3rem',width:'12rem'}}>ANADIR AL CARRITO</button>
                            </div>
                            {/* stock*/}
                            <div>
                                <div style={{fontWeight:'bold'}}>Stock: 
                                    <span style={{fontWeight:'normal'}}> {producto.stock}</span>
                                </div>
                            </div>
                            
                        </div>

                    </div>

            </main>


        </div>
    );
}

// Exportación del componente
export default Vista;