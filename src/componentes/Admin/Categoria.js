import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const url = "http://localhost:8080/api/v1/categorias/";

class GestionCategoria extends Component {
  state = {
    lista: [],
    modalInsertar: false,
    modalEliminar: false,
    tipoModal: '',
    datos: {
      idCategoria: '',
      nombre: '',
      descripcion: ''
    }
  };

  componentDidMount() {
    this.obtenerCategorias();
  }

  obtenerCategorias = () => {
    fetch(url)
      .then(res => res.json())
      .then(data => this.setState({ lista: data }))
      .catch(err => console.error(err));
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarCategoria = (categoria) => {
    this.setState({
      tipoModal: 'actualizar',
      datos: { ...categoria }
    });
    this.modalInsertar();
  };

  cargarDatos = async e => {
    await this.setState({
      datos: {
        ...this.state.datos,
        [e.target.name]: e.target.value
      }
    });
  };

  metodoPost = async () => {
    const { datos } = this.state;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        nombre: datos.nombre,
        descripcion: datos.descripcion
      }),
      headers: {
        "Content-type": "application/json"
      }
    });
    this.modalInsertar();
    this.obtenerCategorias();
  };

  metodoPut = async () => {
    const { datos } = this.state;
    await fetch(url + datos.idCategoria, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json"
      }
    });
    this.modalInsertar();
    this.obtenerCategorias();
  };

  metodoDelete = async () => {
    await fetch(url + this.state.datos.idCategoria, {
      method: "DELETE"
    });
    this.setState({ modalEliminar: false });
    this.obtenerCategorias();
  };

  render() {
    const { datos } = this.state;

    return (
      <div>
        <Navbar />
        <div className='flex'>
          <Sidebar />
        </div>
        <main role="main" className="container">
          <div className="row">
            <button
              type="button"
              className="btn btn-dark mb-4"
              onClick={() => {
                this.setState({ datos: { idCategoria: '', nombre: '', descripcion: '' }, tipoModal: 'insertar' });
                this.modalInsertar();
              }}
            >
              + Nueva Categoría
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.lista.map(cat => (
                <tr key={cat.idCategoria}>
                  <td>{cat.idCategoria}</td>
                  <td>{cat.nombre}</td>
                  <td>{cat.descripcion}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => this.seleccionarCategoria(cat)}
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => this.setState({ datos: cat, modalEliminar: true })}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal de inserción / edición */}
          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader>
              {this.state.tipoModal === 'insertar' ? "Nueva Categoría" : "Editar Categoría"}
            </ModalHeader>
            <ModalBody>
              <label>ID</label>
              <input className="form-control" readOnly name="idCategoria" value={datos.idCategoria || ''} /><br />

              <label>Nombre</label>
              <input className="form-control" name="nombre" onChange={this.cargarDatos} value={datos.nombre} /><br />

              <label>Descripción</label>
              <input className="form-control" name="descripcion" onChange={this.cargarDatos} value={datos.descripcion} />
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal === 'insertar' ? (
                <button className="btn btn-success" onClick={this.metodoPost}>Insertar</button>
              ) : (
                <button className="btn btn-danger" onClick={this.metodoPut}>Actualizar</button>
              )}
              <button className="btn btn-secondary" onClick={this.modalInsertar}>Cancelar</button>
            </ModalFooter>
          </Modal>

          {/* Modal de confirmación de eliminación */}
          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              ¿Estás seguro de que deseas eliminar la categoría <b>{datos.nombre}</b>?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={this.metodoDelete}>Sí</button>
              <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
            </ModalFooter>
          </Modal>
        </main>
      </div>
    );
  }
}

export default GestionCategoria;
