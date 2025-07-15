import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../App.css'


//const url = "http://localhost:8080/api/productos/";

class GestionProducto extends Component {
    state = {
        lista: [],
        modalInsertar: false,
        modalEliminar: false,
        datos: {
            id: '',
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            image_url: '',
            idCategoria: '',
            estado: ''
        },
        tipoModal: '',
        categorias: []
    }

    /*metodoGet = () => {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(lista => {
                this.setState({
                    lista
                })
            });

    }*/
/*
    metodoGetCat = () => {
        fetch("http://localhost:8080/api/categorias/")
            .then(response => {
                return response.json();
            })
            .then(categorias => {
                this.setState({
                    categorias
                })
            });

    }*/

/*
    metodoPost = async () => {
        delete this.state.datos.id;
        await fetch(url, {
            method: "POST",
            body: JSON.stringify(this.state.datos),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(response => {
                this.modalInsertar();
                this.metodoGet();
            }).catch(error => {
                console.log(error.message);
            })
    }*/
/*
    metodoPut = () => {
        fetch(url + this.state.datos.id, {
            method: "PUT",
            body: JSON.stringify(this.state.datos),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(response => {
                this.modalInsertar();
                this.metodoGet();
            }).catch(error => {
                console.log(error.message);
            })
    }*/
/*
    metodoDelete = () => {
        fetch(url + this.state.datos.id, {
            method: "DELETE"
        })
            .then(response => {
                this.setState({
                    modalEliminar: false
                });
                this.metodoGet();
            }).catch(error => {
                console.log(error.message);
            })
    }*/
/*
    modalInsertar = () => {
        this.setState({
            modalInsertar: !this.state.modalInsertar
        });
    }*/
/*
    seleccionarDatos = (productos) => {
        this.setState({
            tipoModal: 'actualizar',
            datos: {
                id: productos.id,
                nombre: productos.nombre,
                idCategoria: productos.idCategoria,
                idMarca: productos.idMarca
            }
        });
    }*/
/*
    cargarDatos = async e => {
        await this.setState({
            datos: {
                ...this.state.datos, [e.target.name]: e.target.value
            }
        });
    }*/
/*
    componentDidMount() {
        this.metodoGet();
        this.metodoGetCat();
        this.metodoGetMar();
    }
*/

    render() {
        const { datos } = this.state;
        return <div>
            
            <Navbar />
            <div className='flex'>
                <Sidebar/>
            </div>
            
            <main role="main" className="container">
                
                <div className="row">
                    <button type="button" className="btn btn-dark mb-4"
                        onClick={() => {
                            this.setState({ datos: null, tipoModal: 'insertar'});
                            this.modalInsertar()
                        }}
                    >+ Nuevo Producto</button>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-dark mb-4"
                        
                        onClick={() => window.open("http://localhost:8080/api/v1/productos/?format=xlsx", "_blank")}
                    >Exportar Stock</button>
                </div>
                <div className="row">
                    <div className="col-9">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Imagen URL</th>
                                    <th>ID Categoría</th>
                                    <th>Estado</th>
                                    <th>Mantenimiento</th></tr>
                            </thead>
                            <tbody>
                                {this.state.lista.map(pro => {
                                    return (
                                        <tr>
                                            <td>{pro.id}</td>
                                            <td>{pro.nombre}</td>
                                            <td>{pro.descripcion}</td>
                                            <td>{pro.precio}</td>
                                            <td>{pro.stock}</td>
                                            <td>{pro.image_url}</td>
                                            <td>{pro.idCategoria}</td>
                                            <td>{pro.estado}</td>
                                            <td>
                                                <button className="btn btn-secondary"
                                                    onClick={() => {
                                                        this.seleccionarDatos(pro);
                                                        this.modalInsertar()
                                                    }}>
                                                    Editar
                                                </button>
                                                {" "}
                                                <button className="btn btn-danger"
                                                    onClick={() => {
                                                        this.seleccionarDatos(pro);
                                                        this.setState({ modalEliminar: true })
                                                    }}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <Modal isOpen={this.state.modalInsertar}>
                            <ModalHeader style={{ display: 'block' }}>
                                <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>X</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className="form-group">

                                    <label htmlFor="id">ID</label>
                                    <input className="form-control" type="text" name="id" id="id" readOnly
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.id : ''}></input><br />

                                    <label htmlFor="nombre">Nombre:</label>
                                    <input className="form-control" type="text" name="nombre" id="nombre"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.nombre : ''}></input><br />

                                    <label htmlFor="descripcion">Descripción:</label>
                                    <input className="form-control" type="text" name="descripcion" id="descripcion"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.descripcion : ''}></input><br />

                                    <label htmlFor="precio">Precio:</label>
                                    <input className="form-control" type="text" name="precio" id="precio"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.precio : ''}></input><br />

                                    <label htmlFor="stock">Stock:</label>
                                    <input className="form-control" type="text" name="stock" id="stock"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.stock : ''}></input><br />

                                    <label htmlFor="image_url">Imagen URL:</label>
                                    <input className="form-control" type="text" name="image_url" id="image_url"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.image_url : ''}></input><br />

                                    <label htmlFor="idCategoria">Categoría:</label>
                                    <select className="form-control" name="idCategoria" id="idCategoria" 
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.idCategoria : ''}>
                                            <option value="">- - - - - -</option>
                                        {  
                                            this.state.categorias.map(cat => {
                                                return <option value={cat.id}>{cat.nombre}</option> 
                                            })
                                        }
                                    </select>
                                   
                                   <label htmlFor="estado">Estado:</label>
                                    <input className="form-control" type="text" name="estado" id="estado"
                                        onChange={this.cargarDatos}
                                        value={datos ? datos.estado : ''}></input><br />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {this.state.tipoModal == "insertar" ?
                                    <button className="btn btn-seccuess" onClick={() => this.metodoPost()}>
                                        Insertar
                                    </button> : <button className="btn btn-danger" onClick={() => this.metodoPut()}>
                                        Actualizar
                                    </button>
                                }
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.modalEliminar}>
                            <ModalBody>
                                Desea Eliminar el Producto {datos && datos.nombre} ?
                            </ModalBody>
                            <ModalFooter>
                                <button className="btn btn-danger" onClick={() => this.metodoDelete()}>
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
    }
}

export default GestionProducto;