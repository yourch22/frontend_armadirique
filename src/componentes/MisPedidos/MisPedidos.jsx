import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/v1/pedidos/mis-pedidos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener pedidos");

        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("❌ Error cargando pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [navigate]);

  const handleVolver = () => navigate("/");

  if (loading)
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status" /></div>;

  if (pedidos.length === 0)
    return (
      <div className="container text-center mt-5">
        <h4 className="mb-4">🧾 Mis Pedidos</h4>
        <p className="text-muted">No tienes pedidos aún.</p>
        <button className="btn btn-outline-primary" onClick={handleVolver}>
          <FaArrowLeft className="me-2" />
          Volver al inicio
        </button>
      </div>
    );

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">🧾 Mis Pedidos</h3>
        <button className="btn btn-outline-secondary" onClick={handleVolver}>
          <FaArrowLeft className="me-2" />
          Volver al inicio
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Total (S/)</th>
              <th>Dirección</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => (
              <tr key={pedido.ventaId}>
                <td>{index + 1}</td>
                <td>{pedido.orderNumber || "N/A"}</td>
                <td>{new Date(pedido.fecha).toLocaleString()}</td>
                <td>{pedido.metodoPago}</td>
                <td>
                  <span className={`badge bg-${pedido.estado === "PENDIENTE" ? "warning" : "success"}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td>{pedido.total.toFixed(2)}</td>
                <td>{pedido.direccionEnvio}</td>
                <td>
                  <ul className="list-unstyled mb-0">
                    {pedido.detalles.map((item, i) => (
                      <li key={i}>
                        <strong>{item.nombreProducto}</strong> - {item.cantidad} x S/ {item.precioUnitario.toFixed(2)} = <strong>S/ {item.subtotal.toFixed(2)}</strong>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MisPedidos;
