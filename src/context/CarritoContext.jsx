import { createContext, useContext, useState, useEffect,useCallback } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const carritoId =1;
  const RecargarCarrito= useCallback(() => {
    setCargando(true);
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el carrito');
        return res.json();
      })
      .then(data => {
        setCarrito(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, [carritoId]);

  const agregarAlCarrito = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}/agregar/${productoId}?cantidad=1`, {
      method: 'POST',
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al agregar:', err));
  };

  const eliminarProducto = (productoId) => {
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}/eliminar/${productoId}`, {
      method: 'DELETE',
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al eliminar producto:', err));
  };

  const vaciarCarrito = () => {
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}/vaciar`, {
      method: 'DELETE',
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al vaciar carrito:', err));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}/actualizar/${productoId}?cantidad=${nuevaCantidad}`, {
      method: 'PUT',
    })
      .then(() => RecargarCarrito())
      .catch(err => console.error('Error al actualizar cantidad:', err));
  };
    useEffect(() => {
    RecargarCarrito();
  }, [RecargarCarrito]);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        cargando,
        error,
        agregarAlCarrito,
        eliminarProducto,
        vaciarCarrito,
        actualizarCantidad,
        RecargarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
