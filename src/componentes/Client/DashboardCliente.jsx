import React, { useEffect, useState } from 'react';
import {
  Container, Navbar, Nav, Offcanvas
} from 'react-bootstrap';
import {
  FaBars, FaUser, FaSearch, FaShoppingCart, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardCliente = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');
  const [productos, setProductos] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [isHoveredButton, setIsHoveredButton] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/actual-usuario', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('No se pudo obtener el usuario');

        const data = await response.json();
        const rol = data.authorities[0]?.authority;

        if (rol === 'ADMIN') {
          window.location.href = '/dashboardadmin';
          return;
        }

        setUsuario(data);
      } catch (error) {
        console.error(error);
        setError('Error al obtener el usuario');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/productos', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
        });

        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProductos(data);
        console.log(data);
      } catch (error) {
        console.error(error);
        setError('Error al cargar productos');
      }
    };

    fetchUsuario();
    fetchProductos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '60px', position: 'relative' }}>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" fixed="top" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <Container fluid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBars style={{ fontSize: '1.5rem', cursor: 'pointer', marginRight: '1rem' }}
              onClick={() => setShowSidebar(true)} />
            <Navbar.Brand href="#">Armadirique</Navbar.Brand>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'center' }}>
            <Nav>
              <Nav.Link href="/inicio">Inicio</Nav.Link>
              <Nav.Link href="/catalogo">Catálogo</Nav.Link>
              <Nav.Link href="#">Contacto</Nav.Link>
              <Nav.Link href="#">Nosotros</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <div style={{ display: 'flex' }}>
            <FaSearch style={{ fontSize: '1.2rem', margin: '0 1rem' }} />
            <FaShoppingCart style={{ fontSize: '1.2rem', margin: '0 1rem' }} />
            <FaUser style={{ fontSize: '1.2rem', margin: '0 1rem' }} onClick={handleLogout} title="Cerrar sesión" />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: '250px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaTimes onClick={() => setShowSidebar(false)} style={{ cursor: 'pointer' }} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/inicio">Inicio</Nav.Link>
            <Nav.Link href="/catalogo">Catálogo</Nav.Link>
            <Nav.Link href="#">Contacto</Nav.Link>
            <Nav.Link href="#">Nosotros</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Contenido principal */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f3f3f3',
        minHeight: '100vh',
        paddingTop: '20px',
      }}>
        {/* Filtros (izquierda) */}
        <div style={{ width: '15%', backgroundColor: '#ddd', padding: '20px' }}>
          <p><strong>Filtros:</strong></p>
          <p>Precio</p>
          <p>Tipo</p>
          <p>Envío</p>
          <p>Descuento</p>
        </div>

        {/* Catálogo (centro) */}
        <div style={{ width: '70%', padding: '20px' }}>
          <h6>Catálogo de productos</h6>
          <p>Bienvenido{usuario ? `, ${usuario.nombre}` : ''}.</p>

          {productos.length === 0 && <p>No hay productos disponibles.</p>}

          {productos.map(prod => (
            
            <div key={prod.idProducto} style={{
              backgroundColor: '#fff',
              margin: '10px 0',
              padding: '30px 15px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              transition: '0.3s ease',
            }}>
              <div>
               <Link to="#">
             <img
                src={`http://localhost:8080/uploads/${prod.imagenUrl}`}
                 alt={prod.nombre}
                   style={{ width: '20vh' }}
               />
               </Link>
              </div>
              <div style={{ flex: 1, marginLeft: '15px' }}>
                <Link to="#" style={{
                  textDecoration: 'none',
                  color: isHovered === prod.idProducto ? '#f7ad02' : 'black',
                }}
                  onMouseEnter={() => setIsHovered(prod.idProducto)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <h6>{prod.nombre}</h6>
                </Link>
                <p>{prod.descripcion}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h6>s/ {prod.precio.toFixed(2)}</h6>
                <button style={{
                  fontSize: '1.7vh',
                  color: isHoveredButton === prod.idProducto ? 'black' : 'white',
                  backgroundColor: isHoveredButton === prod.idProducto ? 'white' : 'black',
                  border: '1px solid black',
                  borderRadius: '10px',
                  padding: '1vh',
                  transition: '0.2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={() => setIsHoveredButton(prod.idProducto)}
                  onMouseLeave={() => setIsHoveredButton(null)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Barra lateral derecha */}
        <div style={{ width: '15%', backgroundColor: '#ddd', padding: '20px' }}>
          {/* Espacio adicional */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;
