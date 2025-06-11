import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../App.css';

// const url = "http://localhost:8080/api/pedidos/";

class GestionPedido extends Component {
  state = {
    lista: [],
    modalInsertar: false,
    modalEliminar: false,
    datos: {
      id: '',
      fecha: '',
      total: '',
      estado: '',
      idUsuario: '',
    },
    tipoModal: '',
  };

  /*metodoGet = () => {
    fetch(url)
      .then(response => response.json())
      .then(lista => this.setState({ lista }));
  }*/

  /*metodoPost = async () => {
    delete this.state.datos.id;
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(this.state.datos),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(() => {
        this.modalInsertar();
        this.metodoGet();
      })
      .catch(error => console.log(error.message));
  }*/

  /*metodoPut = () => {
    fetch(url + this.state.datos.id, {
      method: 'PUT',
      body: JSON.stringify(this.state.datos),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(() => {
        this.modalInsertar();
        this.metodoGet();
      })
      .catch(error => console.log(error.message));
  }*/

  /*metodoDelete = () => {
    fetch(url + this.state.datos.id, {
      method: 'DELETE',
    })
      .then(() => {
        this.setState({ modalEliminar: false });
        this.metodoGet();
      })
      .catch(error => console.log(error.message));
  }*/

  /*modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }*/

  /*seleccionarDatos = (pedido) => {
    this.setState({
      tipoModal: 'actualizar',
      datos: { ...pedido },
    });
  }*/

  /*cargarDatos = async e => {
    await this.setState({
      datos: {
        ...this.state.datos,
        [e.target.name]: e.target.value,
      },
    });
  }*/

  /*componentDidMount() {
    this.metodoGet();
  }*/

  render() {
    const { datos } = this.state;

    return (
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar />
        </div>

        <main role="main" className="container">
          <div className="row">
            <button
              type="button"
              className="btn btn-dark mb-4"
              onClick={() => {
                this.setState({ datos: null, tipoModal: 'insertar' });
                this.modalInsertar();
              }}
            >
              + Nuevo Pedido
            </button>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>ID Usuario</th>
                    <th>Mantenimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.lista.map(ped => (
                    <tr key={ped.id}>
                      <td>{ped.id}</td>
                      <td>{ped.fecha}</td>
                      <td>{ped.total}</td>
                      <td>{ped.estado}</td>
                      <td>{ped.idUsuario}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            this.seleccionarDatos(ped);
                            this.modalInsertar();
                          }}
                        >
                          Editar
                        </button>{' '}
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarDatos(ped);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Modal Insertar */}
              <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader>
                  <span style={{ float: 'right' }} onClick={this.modalInsertar}>
                    X
                  </span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label>ID</label>
                    <input className="form-control" type="text" name="id" readOnly value={datos ? datos.id : ''} onChange={this.cargarDatos} />
                    <label>Fecha</label>
                    <input className="form-control" type="date" name="fecha" value={datos ? datos.fecha : ''} onChange={this.cargarDatos} />
                    <label>Total</label>
                    <input className="form-control" type="text" name="total" value={datos ? datos.total : ''} onChange={this.cargarDatos} />
                    <label>Estado</label>
                    <input className="form-control" type="text" name="estado" value={datos ? datos.estado : ''} onChange={this.cargarDatos} />
                    <label>ID Usuario</label>
                    <input className="form-control" type="text" name="idUsuario" value={datos ? datos.idUsuario : ''} onChange={this.cargarDatos} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  {this.state.tipoModal === 'insertar' ? (
                    <button className="btn btn-success" onClick={this.metodoPost}>
                      Insertar
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={this.metodoPut}>
                      Actualizar
                    </button>
                  )}
                </ModalFooter>
              </Modal>

              {/* Modal Eliminar */}
              <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                  ¿Desea eliminar el pedido {datos && datos.id}?
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-danger" onClick={this.metodoDelete}>
                    Aceptar
                  </button>
                  <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>
                    Cancelar
                  </button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default GestionPedido;
