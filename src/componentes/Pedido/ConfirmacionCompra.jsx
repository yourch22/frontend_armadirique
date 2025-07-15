import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmacionCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderNumber, email, total } = location.state || {};

  const volverInicio = () => {
    navigate('/');
  };

  const verPedidos = () => {
    navigate('/mis-pedidos');
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <div className="text-center">
          <i className="fas fa-check-circle fa-4x text-success mb-4"></i>
          <h2 className="fw-bold">¡Gracias por tu compra!</h2>
          <p className="text-muted">Tu pedido ha sido procesado exitosamente.</p>
        </div>

        <div className="mt-4">
          <h5 className="fw-bold text-primary">Resumen de la compra</h5>
          <ul className="list-group list-group-flush mt-2">
            <li className="list-group-item">
              <strong>Número de orden:</strong> {orderNumber || 'N/A'}
            </li>
            <li className="list-group-item">
              <strong>Correo electrónico:</strong> {email || 'cliente@gmail.com'}
            </li>
            <li className="list-group-item">
              <strong>Total pagado:</strong> S/ {Number(total).toFixed(2) || '0.00'}
            </li>
          </ul>
        </div>

        <div className="mt-4 d-flex justify-content-center gap-3">
          <button className="btn btn-outline-primary" onClick={volverInicio}>
            Volver al inicio
          </button>
          <button className="btn btn-success" onClick={verPedidos}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionCompra;
