// Importaciones necesarias
import { Link } from "react-router-dom";
import Carrito from '../Carrito/Carrito';
import { useCarrito } from '../../context/CarritoContext';
import React, { useEffect, useState } from 'react';
import NavbarCliente from "../Cabeceras/NavbarCliente";
import PieDePagina from '../Cabeceras/PieDePagina';
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



// URL base de tu API
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

// Definición del componente

function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(0);

    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const nextSlide = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
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
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente


    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            position: 'relative'
        }}>
            <NavbarCliente />
            {/**********************************carroulsse******************************************************* */}

            <div style={{ position: 'relative', width: '100%',overflow: 'hidden' }}>

                <img
                    src={images[index]}
                    alt={`Slide ${index + 1}`}
                    style={{
                        width: '100%',      // o '100%' si quieres que se adapte al contenedor
                        height: 'auto',     // puedes ajustarlo según necesites
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
                        
                            <div key={prod.idProducto} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 'inset 0 0 0 1px #c3c3c3',
                                textAlign: 'center',

                            }}>
                                <Link to={`/vista/${prod.idProducto}`} style={{textDecoration: "none",color:'black'}}>
                                <div style={{ padding: '5%' }}>{/*Imagen */}
                                    <img src={`${process.env.REACT_APP_API_URL}/api/v1/uploads/${prod.imagenUrl}`} alt={`mueble${prod.nombre}`}
                                        style={{
                                            width: '90%'

                                        }} />
                                </div>
                                <div style={{ padding: '5%', fontSize: '2.5vh' }}>{/*Texto */}
                                    <p>{prod.nombre}</p>
                                    <p>s/ {prod.precio.toFixed(2)}</p>

                                </div>
                                </Link>
                            </div>
                        
                    ))}
                </div>
            </div>

            <PieDePagina />


            <Carrito />


        </div>

    );
}


export default Catalogo;