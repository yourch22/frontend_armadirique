import React, { useEffect, useState } from 'react';

const Carrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [productos, setProductos] = useState([]);

    useEffect(() => {
      fetch('http://localhost:8080/api/v1/productos') // Usa tu URL real
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err => console.error('Error:', err));
    }, []);




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


useEffect(() => {
    RecargarCarrito();
  }, []);


  if (cargando) return <p>Cargando carrito...</p>;
  if (error) return <p>Error: {error}</p>;

const agregarAlCarrito = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/1/agregar/${productoId}?cantidad=1`, {
      method: 'POST'
    })
    .then(() => RecargarCarrito())
    .catch(err => console.error('Error al agregar:', err));
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



  return (
    <div>
        <h2>Carrito de Compras</h2>
        <button onClick={() => agregarAlCarrito(1)}>Agregar producto 1</button>
        <button onClick={vaciarCarrito}>Vaciar carrito</button>


        {!carrito.items || carrito.items.length === 0 ? (
                <p>El carrito está vacío.</p>

              ) : (
                <ul>
                  {carrito.items.map((item) => (
                    <li key={item.id}>
                        <button onClick={() => actualizarCantidad(item.producto.productoId, item.cantidad - 1)}>-</button>
                        <button onClick={() => actualizarCantidad(item.producto.productoId, item.cantidad + 1)}>+</button>
                      {item.producto.nombre} - Cantidad: {item.cantidad}
                      <button onClick={() => eliminarProducto(item.producto.productoId)}>Eliminar {item.producto.productoId}</button>
                    </li>
                  ))}
                </ul>
              )}

      <h2>agregar productos</h2>
      {productos.map(producto => (
              <div key={producto.idProducto}>
                <h3>{producto.nombre} Id={producto.idProducto}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: {producto.precio}</p>
                <button onClick={() => agregarAlCarrito(producto.idProducto)}>Agregar al carrito</button>

              </div>
            ))}
    </div>
  );
};

export default Carrito;
