// Importaciones necesarias
import React, { useEffect, useState } from 'react';
import Carrito from '../Carrito/Carrito';
import { useCarrito } from '../../context/CarritoContext';
import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Dropdown,
} from "react-bootstrap";
import {
  FaBars,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";



// Definición del componente

function Catalogo() {
  const { agregarAlCarrito, carrito } = useCarrito();


  const totalItems = carrito?.items?.length || 0;
  const [showSidebar, setShowSidebar] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [isHoveredButton, setIsHoveredButton] = useState(null);

  const [carritoVisible, setCarritoVisible] = useState(false);

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

    <div
      style={{
        minHeight: "100vh",
        paddingTop: "60px",
        position: "relative",
      }}
    >
      <Carrito carritoVisible={carritoVisible} toggleCarrito={toggleCarrito} />
      {/* Header/Navbar */}
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
              href="#"
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
              <Nav.Link href="/Inicio">Inicio</Nav.Link>
              <Nav.Link href="/catalogo">Catálogo</Nav.Link>
              <Nav.Link href="#">Contacto</Nav.Link>
              <Nav.Link href="#">Nosotros</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <div style={{ display: "flex", alignItems: "center" }}>
            <FaSearch
              style={{
                fontSize: "1.2rem",
                color: "#333",
                cursor: "pointer",
                margin: "0 1rem",
              }}
            />
            <FaShoppingCart className="icono-carrito" style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }}
              onClick={toggleCarrito} />{totalItems > 0 && (<span className="" >{totalItems}</span>)}


            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  padding: 0,
                  boxShadow: "none",
                  lineHeight: 1, // 🔥 importante para alinear verticalmente
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
                  Cerrar sesión
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
        <Offcanvas.Header closeButton>
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
              href="#"
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
              href="#"
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
              href="#"
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Contacto
            </Nav.Link>
            <Nav.Link
              href="#"
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                color: "#333",
                borderBottom: "1px solid #eee",
              }}
            >
              Nosotros
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/*Cuerpo principal de la pagina */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "100vh",
          backgroundColor: "#f3f3f3",
        }}
      >

        {/* Columna Izquierda */}
        <div
          style={{
            width: "15%",
            backgroundColor: "#ddd",
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2vh",
              fontWeight: "300",
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
            width: "70%",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/*Titulo*/}
          <div style={{ margin: "5px 0" }}>
            <h6>Catalogo</h6>
            Resultados: {productos.length}
          </div>
          {/*Prodcutos*/}
          {productos.map((prod) => (
            <div
              key={prod.id}
              style={{
                backgroundColor: "#fff",
                margin: "10px 0",
                padding: "30px 15px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                transition: "0.3s ease",
                display: "flex",
                width: "100%",
                //height:'25%',
                alignItems: "center",
              }}
            >
              {/*Imagen*/}
              <div>

                <img src={`./imgMuebles/${prod.imagenUrl}.jpg`} alt={prod.imagenUrl} style={{ width: "8rem" }}></img>

              </div>
              {/*Nombre y descripcion*/}
              <div style={{ flex: 1, margin: "0rem 2rem" }}>
                <Link to={`/vista/${prod.idProducto}`}
                  style={{
                    textDecoration: "none",
                    color: isHovered === prod.idProducto ? "#f7ad02" : "black", // Cambia el fondo cuando se pasa el mouse
                    transition: "0.1s", // Transición suave
                  }}
                  onMouseEnter={() => setIsHovered(prod.idProducto)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <h6>{prod.nombre}</h6>
                </Link>

                <p>{prod.descripcion}</p>
              </div>
              {/*Precio y agregar carrito*/}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "end",
                }}
              >
                <h5 style={{ marginBottom: "7vh", textAlign: "center" }}>S/.{prod.precio}</h5>

                <button
                  key={prod.idProducto}
                  style={{
                    fontSize: "1.7vh",
                    color: isHoveredButton === prod.idProducto ? "black" : "white",
                    backgroundColor:
                      isHoveredButton === prod.idProducto ? "white" : "black",
                    transition: "0.2s",
                    borderRadius: "10px",
                    padding: "1vh",
                  }}
                  onMouseEnter={() => setIsHoveredButton(prod.idProducto)}
                  onMouseLeave={() => setIsHoveredButton(null)}
                  onClick={() => agregarAlCarrito(prod.idProducto)}

                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha */}
        <div
          style={{
            width: "15%",
            backgroundColor: "#ddd",
            display: "flex",
            //alignItems: 'center',
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          Barra Derecha
        </div>
      </div>


    </div>
  );
}

// Exportación del componente
export default Catalogo;
