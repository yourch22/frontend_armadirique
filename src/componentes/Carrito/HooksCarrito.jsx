import { useState, useEffect } from 'react';

export function HooksCarrito() {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const RecargarCarrito = () => {
    setCargando(true);
    fetch('http://localhost:8080/api/v1/carrito/1')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener el carrito');
        return res.json();
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

  const agregarAlCarrito = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/1/agregar/${productoId}?cantidad=1`, {
      method: 'POST',
    })
      .then(() => RecargarCarrito())
      .catch((err) => console.error('Error al agregar:', err));
  };

  const eliminarProducto = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/1/eliminar/${productoId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar el producto');
        return res.json();
      })
      .then((data) => {
        setCarrito(data.items);
      })
      .then(() => RecargarCarrito())
      .catch((err) => console.error(err));
  };

  const vaciarCarrito = () => {
    fetch('http://localhost:8080/api/v1/carrito/1/vaciar', {
      method: 'DELETE',
    })
      .then(() => RecargarCarrito())
      .catch((err) => console.error('Error al vaciar:', err));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    fetch(`http://localhost:8080/api/v1/carrito/1/actualizar/${productoId}?cantidad=${nuevaCantidad}`, {
      method: 'PUT',
    })
      .then(() => RecargarCarrito())
      .catch((err) => console.error('Error al actualizar cantidad:', err));
  };

  useEffect(() => {
    RecargarCarrito();
  }, []);

return {
  carrito,
  cargando,
  error,
  agregarAlCarrito,
  eliminarProducto,
  vaciarCarrito,
  actualizarCantidad,
  RecargarCarrito
};

}
