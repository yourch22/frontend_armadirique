// Importaciones necesarias
import React, { useState } from 'react';
import NavbarCliente from "../Cabeceras/NavbarCliente"
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
import slide1 from './slide1.jpg';
import slide2 from './slide2.jpg';
import slide3 from './slide3.jpg';
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

const images = [
  slide1,slide2,slide3
];





// Definición del componente

function Catalogo() {

    //const [showSidebar, setShowSidebar] = useState(false);

    const [index, setIndex] = useState(0);

    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            position: 'relative'
        }}>

<NavbarCliente/> 
            {/**********************************carroulsse******************************************************* */}

            <div style={{ position: 'relative', width: '100%',height:'400px',overflow: 'hidden'}}>
                
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
            <div style={{marginTop:'5vh',marginLeft:'15%',marginRight:'15%',marginBottom:'7vh'}}>
                {/**Promociones encabezado */}  
                <div>
                    <h6>Destacados</h6>
                    <hr/>
                </div>
                {/*Contenedor Cartas */}
                <div style={{
                    display:'grid',
                    //flexWrap:'wrap',
                    //justifyContent: 'space-between',
                    gridTemplateColumns: 'repeat(5, auto)',
                    gap:'20px',
                    
                }}>     
                    {/* carta */}   
                     {productos.map((prod) => (    
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            //border:'1px  #c3c3c3',
                            boxShadow: 'inset 0 0 0 1px #c3c3c3',
                            
                            //width:'19%',
                            //minHeight:'40vh',
                            
                            textAlign:'center',
                            
                            }}>

                            <div style={{padding:'5%'}}>{/*Imagen */}
                                <img src={`./imgMuebles/mueble${prod.id}.jpg`}  alt={`mueble${prod.id}`} 
                                style={{
                                    //border:'1px solid #c3c3c3', 
                                    width:'90%'
                                    
                                }}/>
                            </div>
                            <div style={{padding:'5%',fontSize:'2.5vh'}}>{/*Texto */}
                                <p>{prod.nombre}</p>
                                <p>{prod.precio}</p>
                                
                            </div>
                            


                        </div>
                            
                    ))}


                </div>
                    
                
            </div> 

            <div style={{backgroundColor:'black',height:'300px',color:'white',display:'flex',padding:'10vh 5vh'}}>
                

                
                <div style={{
                    flex:4,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                }}>
                    Armadirique

                </div>
                <div style={{flex:3}}>
                    <p><u>Servicio al cliente</u></p>
                    <p>Terminos y condiciones</p>
                    <p>Contacto</p>
                    <p>Comprobante electronico</p>
                </div>
                <div style={{flex:3}}>
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