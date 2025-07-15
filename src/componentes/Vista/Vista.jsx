// Importaciones necesarias
import React, { useEffect, useState } from "react";
import { useCarrito } from '../../context/CarritoContext';
import { useParams } from "react-router-dom";
import NavbarCliente from "../Cabeceras/NavbarCliente";
import PieDePagina from '../Cabeceras/PieDePagina';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;;

function Vista() {

    const { agregarAlCarrito } = useCarrito();

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    // useEffect para obtener los productos de la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/productos/${id}`);
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
        <div style={{
            minHeight: '100vh',
            paddingTop: '60px',
            position: 'relative'
        }}>
            <NavbarCliente />
            {/* main content*/}
            <main style={{
                padding: '4rem 8rem'
            }}>
                <div style={{
                    display: 'flex',
                    height: '35rem',
                    padding: '1rem',
                    //border:'1px solid black',
                    boxShadow: 'inset 0 0 0 1px #c3c3c3',
                    borderRadius: '1rem'
                }}>
                    {/* imagen*/}
                    <div style={{ width: '50%', alignSelf: 'center' }}>
                        <img src={`${process.env.REACT_APP_API_URL}/api/v1/uploads/${productos.imagenUrl}`} style={{ width: '30rem', objectFit: 'cover' }} alt="" />
                    </div>

                    {/* info*/}
                    <div style={{ width: '50%', margin: '0rem 2rem' }}>
                        {/* nombre*/}
                        <div style={{ fontWeight: 'bold', fontSize: '1.3rem', margin: '1rem 0rem' }}>
                            {productos.nombre}
                        </div>
                        <hr />
                        {/* descripcion*/}
                        <div style={{ margin: '2rem 0rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Descripcion:</div>
                            <div>{productos.descripcion}</div>
                        </div>
                        {/* estilos*/}
                        <div style={{ margin: '2rem 0rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Estilos:</div>
                            <div></div>
                        </div >
                        {/* precio*/}
                        <div style={{ margin: '2rem 2rem', textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>S./{productos.precio}</div>
                        </div>
                        {/* boton*/}
                        <div style={{ margin: '1rem 2rem', textAlign: 'right' }}>
                            <button style={{ height: '3rem', width: '12rem' }} onClick={(e) => { e.preventDefault(); agregarAlCarrito(productos.idProducto) }}>ANADIR AL CARRITO</button>
                        </div>
                        {/* stock*/}
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Stock:
                                <span style={{ fontWeight: 'normal' }}> {productos.stock}</span>
                            </div>
                        </div>

                    </div>

                </div>

            </main>

            <PieDePagina />
        </div>
    );
}

export default Vista;