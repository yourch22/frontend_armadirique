import React from 'react';


export default function ProductosTable({
  productos = [],
  pagination,
  handleSizeChange,
  handleSortChange,
  handlePageChange,
  handleEditar,
  handleEliminar,
}) {
  return (
    <>
      {/* Controles de paginación */}
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <span className="me-2">Mostrar:</span>
          <select 
            className="form-select form-select-sm" 
            style={{ width: '70px' }}
            value={pagination.size}
            onChange={handleSizeChange}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="ms-2">elementos</span>
        </div>
        <div>
          <span className="me-2">
            Página {pagination.page + 1} de {pagination.totalPages}
          </span>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>
                <button 
                  className="btn btn-link text-white p-0 text-decoration-none" 
                  onClick={() => handleSortChange('precio')}
                >
                  Precio
                  {pagination.sort.includes('precio,asc') && ' ↑'}
                  {pagination.sort.includes('precio,desc') && ' ↓'}
                </button>
              </th>
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
              productos.map((prod,item) => (
                <tr key={prod.idProducto}>
                  <td>{item + 1}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.descripcion}</td>
                  <td>S/ {prod.precio.toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <img 
                      src={`http://localhost:8080/api/v1/uploads/${prod.imagenUrl}`} 
                      alt={prod.nombre} 
                      style={{ width: "80px" }} 
                    />
                  </td>
                  <td>{prod.nombreCategoria ?? "Sin categoría"}</td>
                  <td>{prod.estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditar(prod)}
                    >
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

      {/* Navegación de paginación */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pagination.page === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(0)}>Primera</button>
          </li>
          <li className={`page-item ${pagination.page === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)}>Anterior</button>
          </li>

          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i;
            } else if (pagination.page <= 2) {
              pageNum = i;
            } else if (pagination.page >= pagination.totalPages - 3) {
              pageNum = pagination.totalPages - 5 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <li 
                key={pageNum} 
                className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                  {pageNum + 1}
                </button>
              </li>
            );
          })}

          <li className={`page-item ${pagination.page >= pagination.totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)}>Siguiente</button>
          </li>
          <li className={`page-item ${pagination.page >= pagination.totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagination.totalPages - 1)}>Última</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
