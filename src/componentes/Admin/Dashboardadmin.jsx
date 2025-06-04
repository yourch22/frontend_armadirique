<<<<<<< HEAD
import React, { useEffect, useState } from 'react';

const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
=======
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';

const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
>>>>>>> origin/main
      return;
    }

    const fetchUsuario = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch('http://localhost:8080/actual-usuario', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el usuario');
        }

        const data = await response.json();
        setUsuario(data);

        // Aquí podrías usar data.authorities[0].authority si necesitas el rol
        console.log('Usuario actual:', data); // ✅ Aquí lo ves en consola
        console.log('Token:', token); // ✅ Aquí lo ves en consola
         console.log('Rol:', data.authorities[0].authority); // ✅ Aquí lo ves en consola rol del usuario actual
        const rol = data.authorities[0]?.authority;
        console.log('ROL DEL USUARIO:', rol);

        if (rol !== 'ADMIN') {
          // Redirige si no es admin
          window.location.href = '/dashboardcliente';
        }

      } catch (error) {
        console.error(error);
        setError('Error al obtener el usuario');
        localStorage.removeItem('token');
        window.location.href = '/login';
=======
        const response = await fetch("http://localhost:8080/api/v1/auth/actual-usuario", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        const response = await fetch("http://localhost:8080/api/v1/productos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("No se pudo obtener los productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
        setError("Error al obtener los productos");
>>>>>>> origin/main
      }
    };

    fetchUsuario();
<<<<<<< HEAD
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bienvenido al Dashboard Admin</h1>
      {usuario ? (
        <>
          <p>Sesión iniciada como: <strong>{usuario.nombre} {usuario.apellidos}</strong></p>
          <p>Rol: <strong>{usuario.authorities[0]?.authority}</strong></p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
=======
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
          const response = await fetch(
            `http://localhost:8080/api/v1/productos/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

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

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  if (!usuario) {
    return (
      <div className="text-center mt-5">Cargando datos del usuario...</div>
    );
  }

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "220px" }}>
        <h4 className="text-uppercase mb-4">ARMADIRIQUE</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              Inicio
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              Usuarios
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              Productos
            </a>
          </li>
          <li className="nav-item mt-4">
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-light w-100"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-secondary text-white p-4">
        <div className="bg-dark text-center p-3 mb-4">
          <h5 className="m-0">AGREGAR PRODUCTO</h5>
        </div>

        {/* Info usuario */}
        <div className="mb-3">
          <p className="mb-1">
            <strong>Administrador:</strong> {usuario.nombre} {usuario.apellidos}
          </p>
          <p className="mb-4">
            <strong>Rol:</strong> {usuario.authorities[0]?.authority}
          </p>
        </div>

        {/* Tabla productos */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm text-white align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                {/* <th>IMAGEN URL</th> */}
                {/* <th>ID CATEGORÍA</th> */}
                <th>ESTADO</th>
                <th>MANTENIMIENTO</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay productos disponibles
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.idProducto}>
                    <td>{prod.idProducto}</td>
                    <td>{prod.nombre}</td>
                    <td>{prod.descripcion}</td>
                    <td>S/{prod.precio.toFixed(2)}</td>
                    <td>{prod.stock}</td>
                    {/* <td>{prod.imagenUrl}</td> */}
                    {/* <td>{prod.idCategoria ?? "Sin categoría"}</td> */}
                    <td>{prod.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(prod.idProducto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
>>>>>>> origin/main
    </div>
  );
};

export default DashboardAdmin;
