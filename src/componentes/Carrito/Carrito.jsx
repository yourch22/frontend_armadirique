import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/v1/carrito";

function Carrito() {
  const [items, setItems] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);

  // Cargar productos del carrito al iniciar
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/carrito")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Agregar producto
  const agregarProducto = () => {
    if (!productoId) return alert("Ingresa ID del producto");

    // Aquí deberías obtener los datos del producto,
    // para el ejemplo usamos sólo el id y nombre dummy
    const producto = {
      id: Number(productoId),
      nombre: "Producto " + productoId,
      precio: 10.0,
    };

    fetch(`${"http://localhost:8080/api/v1/carrito"}/agregar?cantidad=${cantidad}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    })
      .then(() => {
        // Recargar carrito después de agregar
        return fetch("http://localhost:8080/api/v1/carrito").then(res => res.json());
      })
      .then(data => setItems(data));
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    fetch(`${"http://localhost:8080/api/v1/carrito"}/eliminar/${id}`, { method: "DELETE" })
      .then(() => fetch(API_URL))
      .then(res => res.json())
      .then(data => setItems(data));
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    fetch(`${"http://localhost:8080/api/v1/carrito"}/vaciar`, { method: "DELETE" })
      .then(() => fetch(API_URL))
      .then(res => res.json())
      .then(data => setItems(data));
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <div>
        <input
          type="number"
          placeholder="ID Producto"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
        <button onClick={agregarProducto}>Agregar</button>
        <button onClick={vaciarCarrito}>Vaciar Carrito</button>
      </div>
      <ul>
        {items.map(({ producto, cantidad }) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio} x {cantidad}
            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Carrito;
