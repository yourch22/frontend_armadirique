import React, { useEffect, useState } from 'react';
import './carrito-estilos.css';



const Carrito = ({ carritoVisible, toggleCarrito }) => {

  useEffect(() => {
  RecargarCarrito();
  }, []);
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

    const agregarAlCarrito = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/1/agregar/${productoId}?cantidad=1`, {
      method: 'POST',
    })
      .then(() => RecargarCarrito())
      .catch((err) => console.error('Error al agregar:', err));
  };


  const RecargarCarrito = () => {
    setCargando(true); // <- Agrega esto
    fetch('http://localhost:8080/api/v1/carrito/1')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener el carrito');
        return response.json();
      })
      .then((data) => {
        setCarrito(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  };
  const eliminarProducto = (productoId) => {

    fetch(`http://localhost:8080/api/v1/carrito/1/eliminar/${productoId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar el producto');
        return res.json();
      })
      .then(data => {
        setCarrito(data.items); // Actualiza el carrito con los nuevos datos
      })
      .then(() => RecargarCarrito())
      .catch(err => console.error(err));
  };
  const vaciarCarrito = () => {
    fetch('http://localhost:8080/api/v1/carrito/1/vaciar', {
      method: 'DELETE'
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al vaciar el carrito:', err));
  };
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return; // No permitir menos de 1

    fetch(`http://localhost:8080/api/v1/carrito/1/actualizar/${productoId}?cantidad=${nuevaCantidad}`, {
      method: 'PUT'
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al actualizar cantidad:', err));
  };


  if (cargando) return <p>Cargando carrito...</p>;
  if (error) return <p>Error: {error}</p>;


  const PrecioTotal = carrito.items.reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);


  return (
    <div>

      <div className={`carrito ${carritoVisible ? 'visible' : ''}`}>

        <h6>Carrito de Compras</h6>
        <div className='botones-superiores'>
          <button onClick={vaciarCarrito}>Vaciar carrito</button>
          <button onClick={toggleCarrito}>X</button>
        </div>


        {!carrito.items || carrito.items.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div className='contenedor-carrito'>
            <div className='item-carrito'>
              {carrito.items.map((item) => (

                <div className='item' key={item.id}>
                  <div className='seccion-izquierda'>
                    <div className='marco-miniatura'>
                      <img className='producto-miniatura' src={`/imgMuebles/${item.producto.imagenUrl}.jpg`} alt="" />
                    </div>
                  </div>
                  <div className='seccion-central'>
                    <div className='nombre'>{item.producto.nombre}</div>
                    <div className='precio'>s./{item.producto.precio * item.cantidad}</div>
                    <div className='cantidad-seccion'>
                      <button className="btn-cantidad" onClick={() => actualizarCantidad(item.producto.productoId, item.cantidad - 1)}>-</button>
                      <div className='cantidad'>{item.cantidad}</div>
                      <button className="btn-cantidad" onClick={() => actualizarCantidad(item.producto.productoId, item.cantidad + 1)}>+</button>
                    </div>
                  </div>
                  <div className='seccion-derecha'>
                    <button className='btn-eliminar' onClick={() => eliminarProducto(item.producto.productoId)}>X</button>
                  </div>

                </div>

              ))}
              <div className='total-precio'>
                <div>Total: {PrecioTotal}</div>
              </div>
              <div className='comprar'>
                <button className='btn-comprar'>Comprar</button>
              </div>

            </div>
          </div>

        )}
        {/*
      <h2>agregar productos</h2>
      {productos.map(producto => (
        <div key={producto.idProducto}>
          <h3>{producto.nombre} Id={producto.idProducto}</h3>
          <p>{producto.descripcion}</p>
          <p>Precio: {producto.precio}</p>
          <button onClick={() => agregarAlCarrito(producto.idProducto)}>Agregar al carrito</button>

        </div>
      ))}
    */}
      </div>
    </div>
  );
};

export default Carrito;
