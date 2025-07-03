import React from "react";
import "./carrito-estilos.css";
import { useCarrito } from "../../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Carrito = ({ carritoVisible, toggleCarrito }) => {
  const { usuario } = useAuth(); // Obtener usuario autenticado
  const navigate = useNavigate();
  const { carrito, eliminarProducto, vaciarCarrito, actualizarCantidad } =
    useCarrito();

  if (!carrito) return null;

  const totalPrecio =
    carrito?.items?.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    ) || 0;

  // Verifica autenticación antes de continuar al checkout
  const irAlCheckout = () => {
    if (!usuario || !usuario.token) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para continuar con la compra.",
        confirmButtonText: "Ir al login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (carrito.items && carrito.items.length > 0) {
      toggleCarrito();
      navigate("/checkout", {
        state: {
          productosCarrito: carrito.items,
          totalPrecio: totalPrecio,
          usuarioId: usuario.id,
        },
      });
    } else {
      alert("Agrega productos al carrito antes de continuar");
    }
  };

  return (
    <div>
      <div className={`carrito ${carritoVisible ? "visible" : ""}`}>
        <h6>Carrito de Compras</h6>
        <div className="botones-superiores">
          <button onClick={vaciarCarrito}>Vaciar carrito</button>
          <button onClick={toggleCarrito}>X</button>
        </div>
        {!carrito.items || carrito.items.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div className="contenedor-carrito">
            <div className="item-carrito">
              {carrito.items.map((item) => (
                <div className="item" key={item.id}>
                  <div className="seccion-izquierda">
                    <div className="marco-miniatura">
                      <img
                        className="producto-miniatura"
                        src={`http://localhost:8080/api/v1/uploads/${item.producto.imagenUrl}`}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="seccion-central">
                    <div className="nombre">{item.producto.nombre}</div>
                    <div className="precio">
                      s./{item.producto.precio * item.cantidad}
                    </div>
                    <div className="cantidad-seccion">
                      <button
                        className="btn-cantidad"
                        onClick={() =>
                          actualizarCantidad(
                            item.producto.productoId,
                            item.cantidad - 1
                          )
                        }
                      >
                        -
                      </button>
                      <div className="cantidad">{item.cantidad}</div>
                      <button
                        className="btn-cantidad"
                        onClick={() =>
                          actualizarCantidad(
                            item.producto.productoId,
                            item.cantidad + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="seccion-derecha">
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProducto(item.producto.productoId)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <div className="total-precio">
                <div>Total: S/{totalPrecio.toFixed(2)}</div>
              </div>
              <div className="comprar">
                <button className="btn-comprar" onClick={irAlCheckout}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
