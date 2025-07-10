import React from 'react';


export default function CategoriasTable({
  categorias = [],
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

      {/* Tabla de categorias */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => (
                <tr key={cat.categoriaId}>
                  <td>{cat.categoriaId}</td>
                  <td>{cat.titulo}</td>
                  <td>{cat.descripcion}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditar(cat)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleEliminar(cat.idCategoria)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
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
