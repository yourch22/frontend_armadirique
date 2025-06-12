import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import ProductosTable from "./ProductosTable";
import "./styleadmin.css"; // Importa el CSS personalizado
const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
    idUsuario: "",
  });
  // Estado para la paginación
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: "precio,asc",
    totalElements: 0,
    totalPages: 0,
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const fetchUsuario = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/auth/actual-usuario",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

    fetchUsuario();
    fetchProductos(); // Llamamos a fetchProductos inicialmente
    fetchCategorias(); // Cargamos las categorías al inicio
  }, []);
  // Función para cargar productos con paginación
  const fetchProductos = async (
    page = pagination.page,
    size = pagination.size,
    sort = pagination.sort
  ) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:8080/api/v1/productos/paginado?page=${page}&size=${size}&sort=${sort}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("No se pudo obtener los productos");
      const data = await response.json();
      setProductos(data.content);
      setPagination((prev) => ({
        ...prev,
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        sort: sort,
      }));
    } catch (error) {
      console.error(error);
      setError("Error al obtener los productos");
    }
  };
  // Función para cargar categorías
  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/v1/productos/categorias",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("No se pudo obtener las categorías");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

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
          const response = await fetch(
            `http://localhost:8080/api/v1/productos/${id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) throw new Error("No se pudo eliminar el producto");
          fetchProductos(pagination.page, pagination.size, pagination.sort);
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
    const val =
      type === "checkbox"
        ? checked
        : type === "file"
        ? files[0]
        : name === "idCategoria"
        ? Number(value)
        : value;

    setNuevoProducto((prev) => ({
      ...prev,
      [name]: val,
      idUsuario: prev.idUsuario || localStorage.getItem("userId"),
    }));
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
      fetchProductos(pagination.page, pagination.size, pagination.sort);
      setShowModal(false);
      setEditando(false);
      Swal.fire(
        "Éxito",
        `Producto ${editando ? "actualizado" : "guardado"} correctamente`,
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        `No se pudo ${editando ? "actualizar" : "guardar"} el producto`,
        "error"
      );
    }
  };

  const handlePageChange = (newPage) => {
    fetchProductos(newPage, pagination.size, pagination.sort);
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    fetchProductos(0, newSize, pagination.sort);
  };

  const handleSortChange = (field) => {
    const [currentField, currentDirection] = pagination.sort.split(",");
    const newDirection =
      currentField === field && currentDirection === "asc" ? "desc" : "asc";
    const newSort = `${field},${newDirection}`;
    fetchProductos(0, pagination.size, newSort);
  };
  /**
   * Función para exportar productos a Excel
   * Utiliza la API de exportación del backend para obtener el archivo Excel
   */
  const exportarExcel = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/productos/exportar/excel",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Error al exportar Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para descargar el archivo
      const a = document.createElement("a");
      a.href = url;
      a.download = "productos.xlsx"; // nombre del archivo
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("No se pudo exportar el archivo Excel");
    }
  };

  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!usuario)
    return (
      <div className="text-center mt-5">Cargando datos del usuario...</div>
    );

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Sidebar */}
  <nav className="sidebar-nav bg-dark text-white p-3" style={{ minWidth: "220px" }}>
  <h4 className="text-uppercase mb-4 text-center">ARMADIRIQUE</h4>
  <ul className="nav flex-column">
    {[
      { label: "Inicio", key: "inicio" },
      { label: "Gestión de Usuarios", key: "usuarios" },
      { label: "Gestión de Productos", key: "productos" },
      { label: "Gestión de Pedidos", key: "pedidos" },
      { label: "Inventario", key: "inventario" },
      { label: "Producción", key: "produccion" },
      { label: "Reportes", key: "reportes" },
      { label: "Configuración", key: "configuracion" },
    ].map((item) => (
      <li key={item.key} className="nav-item">
        <button
          className={`nav-link btn btn-link text-start w-100 ${
            vistaActual === item.key ? "active" : ""
          }`}
          onClick={() => setVistaActual(item.key)}
        >
          {item.label}
        </button>
      </li>
    ))}
    <li className="nav-item mt-4">
      <button
        onClick={handleLogout}
        className="btn btn-sm btn-outline-light w-100"
      >
        Cerrar sesión
      </button>
    </li>
  </ul>
</nav>


      {/* Main Content */}
      <main className="flex-grow-1 bg-light p-4 overflow-auto">
        <div className="container-fluid">
          <div className="mb-3">
            <h4>
              Bienvenido, {usuario.nombre} {usuario.apellidos} (
              {usuario.authorities[0]?.authority})
            </h4>
          </div>
          {vistaActual === "inicio" && <h5>Panel de administración general</h5>}
          {vistaActual === "usuarios" && (
            <h5>Gestión de usuarios (en construcción)</h5>
          )}
          {vistaActual === "productos" && (
            <>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                <h5 className="mb-2 mb-md-0">Gestión de productos</h5>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setEditando(false);
                      setNuevoProducto({
                        idProducto: null,
                        nombre: "",
                        descripcion: "",
                        precio: "",
                        stock: "",
                        imagenUrl: null,
                        estado: true,
                        idCategoria: "",
                        idUsuario: "",
                      });
                      setShowModal(true);
                    }}
                  >
                    + Añadir nuevo producto
                  </button>

                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={exportarExcel}
                  >
                    Exportar a Excel
                  </button>
                </div>
              </div>

              {/* Tabla de Productos */}
              <ProductosTable
                productos={productos}
                pagination={pagination}
                handleSizeChange={handleSizeChange}
                handleSortChange={handleSortChange}
                handlePageChange={handlePageChange}
                handleEditar={handleEditar}
                handleEliminar={handleEliminar}
              />
            </>
          )}
          {vistaActual === "pedidos" && (
            <h5>Gestión de pedidos (en construcción)</h5>
          )}
          {vistaActual === "inventario" && (
            <h5>Gestión de inventario (en construcción)</h5>
          )}
          {vistaActual === "produccion" && (
            <h5>Gestión de producción (en construcción)</h5>
          )}
          {vistaActual === "reportes" && (
            <h5>Generación de reportes (en construcción)</h5>
          )}
          {vistaActual === "configuracion" && (
            <h5>Configuración del sistema (en construcción)</h5>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editando ? "Editar Producto" : "Nuevo Producto"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={nuevoProducto.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={nuevoProducto.descripcion}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={nuevoProducto.precio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={nuevoProducto.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      name="idCategoria"
                      className="form-control"
                      value={nuevoProducto.idCategoria}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.categoriaId} value={cat.categoriaId}>
                          {cat.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className="form-control mb-2"
                    type="hidden"
                    name="idUsuario"
                    value={usuario.usuarioId}
                    onChange={handleInputChange}
                  />
                  <div className="mb-3">
                    <label className="form-label">Imagen</label>

                    {/* Mostrar imagen actual solo si estás editando y hay una imagen */}
                    {editando && nuevoProducto.imagenUrl && (
                      <div className="mb-2">
                        <img
                          src={`http://localhost:8080/api/v1/uploads/${nuevoProducto.imagenUrl}`}
                          alt="Imagen del producto"
                          style={{
                            width: "150px",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    )}

                    {/* Input para subir nueva imagen */}
                    <input
                      type="file"
                      className="form-control"
                      name="imagenUrl"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="estado"
                      checked={nuevoProducto.estado}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">Activo</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGuardarProducto}
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardAdmin;
