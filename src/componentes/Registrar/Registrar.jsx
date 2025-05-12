import React, { useState } from 'react';
import { 
  Container, 
  Form, 
  Button, 
  Card, 
  Row, 
  Col, 
  Alert,
  Navbar,
  FormSelect
} from 'react-bootstrap';
import { 
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Lista de países con prefijos
const countryCodes = [
  { code: '+51', name: 'Perú' },
  { code: '+1', name: 'EE.UU.' },
  { code: '+52', name: 'México' },
  { code: '+34', name: 'España' },
  { code: '+54', name: 'Argentina' },
  { code: '+56', name: 'Chile' },
  { code: '+57', name: 'Colombia' },
  { code: '+58', name: 'Venezuela' },
];

const Registrar = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    countryCode: '+51',
    telefono: '',
    email: '',
    estado: true,
    perfil: null,
    fechaNacimiento: null
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, perfil: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fechaNacimiento: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
    
    if (!formData.fechaNacimiento) {
      setErrorMessage('Ingrese su fecha de nacimiento');
      return;
    }
    
    console.log('Datos registrados:', formData);
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'rgba(235, 224, 224, 0.49)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Header personalizable */}
      <Navbar 
        expand="lg" 
        className="shadow-sm"
        style={{ 
          backgroundColor: '#f8f9fa',
          padding: '15px 0'
        }}
      >
        <Container>
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            className="text-dark text-decoration-none"
            style={{ 
              fontWeight: '500',
              marginLeft: '-50px'
            }}
          >
            <FaArrowLeft className="me-2" /> Volver
          </Button>

          <Navbar.Brand 
            className="mx-auto"
            style={{ 
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#333',
              letterSpacing: '1px'
            }}
          >
            ARMADIRIQUE
          </Navbar.Brand>
          
          <div style={{ width: '160px' }}></div>
        </Container>
      </Navbar>

      {/* Formulario */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={6}>
            <Card className="border-0 shadow-lg" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              overflow: 'hidden'
            }}>
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-center text-dark mb-4">Crear Cuenta</h2>
                
                {errorMessage && (
                  <Alert variant="danger" className="rounded-pill">
                    {errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-dark">
                          <FaUser className="me-2 text-primary" />
                          Nombre
                        </Form.Label>
                        <Form.Control
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-dark">
                          Apellido
                        </Form.Label>
                        <Form.Control
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaUser className="me-2 text-primary" />
                      Nombre de usuario
                    </Form.Label>
                    <Form.Control
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaEnvelope className="me-2 text-primary" />
                      Correo electrónico
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaPhone className="me-2 text-primary" />
                      Teléfono
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <FormSelect
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="flex-grow-0 w-auto"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code}
                          </option>
                        ))}
                      </FormSelect>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      Dirección
                    </Form.Label>
                    <Form.Control
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      Ciudad
                    </Form.Label>
                    <Form.Control
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaCalendarAlt className="me-2 text-primary" />
                      Fecha de nacimiento
                    </Form.Label>
                    <DatePicker
                      selected={formData.fechaNacimiento}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Seleccionar fecha"
                      className="form-control"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">
                      <FaImage className="me-2 text-primary" />
                      Foto de perfil
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-dark">
                          <FaLock className="me-2 text-primary" />
                          Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="text-dark">
                          Confirmar contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 rounded-pill mt-3"
                  >
                    Registrarse
                  </Button>

                  <p className="text-center text-dark mt-4 mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                      }}
                      className="text-primary text-decoration-none fw-bold"
                    >
                      Inicia sesión
                    </a>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Registrar;