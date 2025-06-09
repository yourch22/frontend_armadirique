import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [vistaActual, setVistaActual] = useState("inicio");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    idProducto: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: null,
    estado: true,
    idCategoria: "",
    idUsuario: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUsuario = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/auth/actual-usuario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("No se pudo obtener el usuario");

        const data = await response.json();
        setUsuario(data);

        const rol = data.authorities[0]?.authority;
        if (rol !== "ADMIN") window.location.href = "/dashboardcliente";
      } catch (error) {
        console.error(error);
        setError("Error al obtener el usuario");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/v1/productos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("No se pudo obtener los productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
        setError("Error al obtener los productos");
      }
    };

    fetchUsuario();
    fetchProductos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este producto luego",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:8080/api/v1/productos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("No se pudo eliminar el producto");
          setProductos(productos.filter((p) => p.idProducto !== id));

          Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  const handleEditar = (producto) => {
    setNuevoProducto({ ...producto });
    setEditando(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setNuevoProducto({ ...nuevoProducto, [name]: val });
  };

  const handleGuardarProducto = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (const key in nuevoProducto) {
      formData.append(key, nuevoProducto[key]);
    }

    const url = editando
      ? `http://localhost:8080/api/v1/productos/${nuevoProducto.idProducto}`
      : "http://localhost:8080/api/v1/productos";
    const method = editando ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Error al guardar el producto");
      const data = await response.json();

      if (editando) {
        setProductos(productos.map((p) => (p.idProducto === data.idProducto ? data : p)));
      } else {
        setProductos([...productos, data]);
      }

      setShowModal(false);
      setEditando(false);
      Swal.fire("Éxito", `Producto ${editando ? "actualizado" : "guardado"} correctamente`, "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `No se pudo ${editando ? "actualizar" : "guardar"} el producto`, "error");
    }
  };

  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!usuario) return <div className="text-center mt-5">Cargando datos del usuario...</div>;

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ minWidth: "220px" }}>
        <h4 className="text-uppercase mb-4 text-center">ARMADIRIQUE</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="btn btn-link nav-link text-white" onClick={() => setVistaActual("inicio")}>
              Inicio
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link text-white" onClick={() => setVistaActual("usuarios")}>
              Usuarios
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link text-white" onClick={() => setVistaActual("productos")}>
              Productos
            </button>
          </li>
          <li className="nav-item mt-4">
            <button onClick={handleLogout} className="btn btn-sm btn-outline-light w-100">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-grow-1 bg-light p-4 overflow-auto">
        <div className="container-fluid">
          <div className="mb-3">
            <h4>Bienvenido, {usuario.nombre} {usuario.apellidos} ({usuario.authorities[0]?.authority})</h4>
          </div>

          {vistaActual === "inicio" && <h5>Panel de administración general</h5>}
          {vistaActual === "usuarios" && <h5>Gestión de usuarios (en construcción)</h5>}

          {vistaActual === "productos" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Gestión de productos</h5>
                <button className="btn btn-success btn-sm" onClick={() => { setEditando(false); setNuevoProducto({ idProducto: null, nombre: "", descripcion: "", precio: "", stock: "", imagenUrl: null, estado: true, idCategoria: "", idUsuario: "" }); setShowModal(true); }}>
                  + Añadir nuevo producto
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover table-sm align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Imagen</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">No hay productos disponibles</td>
                      </tr>
                    ) : (
                      productos.map((prod) => (
                        <tr key={prod.idProducto}>
                          <td>{prod.idProducto}</td>
                          <td>{prod.nombre}</td>
                          <td>{prod.descripcion}</td>
                          <td>S/ {prod.precio.toFixed(2)}</td>
                          <td>{prod.stock}</td>
                          <td>
                            <img src={`http://localhost:8080/api/v1/uploads/${prod.imagenUrl}`} alt={prod.nombre} style={{ width: "80px" }} />
                          </td>
                          <td>{prod.nombreCategoria ?? "Sin categoría"}</td>
                          <td>{prod.estado ? "Activo" : "Inactivo"}</td>
                          <td>
                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(prod)}>Editar</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(prod.idProducto)}>Eliminar</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar producto" : "Añadir nuevo producto"}</h5>
                <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={handleInputChange} />
                <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleInputChange} />
                <input className="form-control mb-2" name="precio" placeholder="Precio" type="number" step="0.01" value={nuevoProducto.precio} onChange={handleInputChange} />
                <input className="form-control mb-2" name="stock" placeholder="Stock" type="number" value={nuevoProducto.stock} onChange={handleInputChange} />
                <input className="form-control mb-2" name="imagenUrl" type="file" accept="image/*" onChange={handleInputChange} />
                <input className="form-control mb-2" name="idCategoria" placeholder="ID Categoría" value={nuevoProducto.idCategoria} onChange={handleInputChange} />
                <input className="form-control mb-2" name="idUsuario" placeholder="ID Usuario" value={nuevoProducto.idUsuario} onChange={handleInputChange} />
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="estado" checked={nuevoProducto.estado} onChange={handleInputChange} />
                  <label className="form-check-label">Activo</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarProducto}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;