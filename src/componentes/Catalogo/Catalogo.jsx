// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import NavbarCliente from "../Cabeceras/NavbarCliente"
import PieDePagina from '../Cabeceras/PieDePagina'

import { Link } from "react-router-dom";

// URL base de tu API
const API_BASE_URL = 'http://localhost:8080/api/v1';
// Definición del componente

function Catalogo() {
  //const [showSidebar, setShowSidebar] = useState(false);
  const { agregarAlCarrito} = useCarrito();

  const [isHovered, setIsHovered] = useState(null);
  const [isHoveredButton, setIsHoveredButton] = useState(null);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // useEffect para obtener los productos de la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("No se pudieron cargar los productos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        position: "relative",
      }}
    >
      <NavbarCliente />

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
              key={prod.idProducto}
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
                <Link to="#">
                  <img src={`http://localhost:8080/api/v1/uploads/${prod.imagenUrl}`} alt={`${prod.imagenUrl}`} style={{ width: "20vh" }}></img>
                </Link>
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
                <h6 style={{ marginBottom: "7vh" }}> s/ {prod.precio.toFixed(2)}</h6>

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
      <PieDePagina />
    </div>
  );
}

// Exportación del componente
export default Catalogo;
