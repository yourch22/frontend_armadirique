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
  Nav,
  FormCheck,
  Offcanvas
} from 'react-bootstrap';
import { 
  FaBars, 
  FaUser, 
  FaSearch, 
  FaShoppingCart,
  FaFacebook,
  FaGoogle,
  FaTimes
} from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import fondoLogin from './mueble.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    showPassword: false,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Correo o contraseña incorrectos.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
  
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '60px',
      position: 'relative'
    }}>
      {/* Fondo de imagen */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -1,
        filter: 'brightness(0.8)'   
      }} />
      
      {/* Header/Navbar */}
      <Navbar bg="light" expand="lg" style={{
        backgroundColor: '#fff !important',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000
      }}>
        <Container fluid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBars 
              style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#333', marginRight: '1rem' }} 
              onClick={() => setShowSidebar(true)}
            />
            <Navbar.Brand href="#" style={{
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#333'
            }}>Armadirique</Navbar.Brand>
          </div>
          
          <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'center' }}>
            <Nav style={{ margin: '0 auto' }}>
              <Nav.Link href="/inicio">Inicio</Nav.Link>
              <Nav.Link href="/catalogo">Catálogo</Nav.Link>
              <Nav.Link href="#">Contacto</Nav.Link>
              <Nav.Link href="#">Nosotros</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          
          <div style={{ display: 'flex' }}>
            <FaSearch style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
            <FaShoppingCart style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
            <FaUser style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer', margin: '0 1rem' }} />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar/Menú desplegable */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: '250px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaTimes 
              style={{ fontSize: '1.5rem', cursor: 'pointer' }} 
              onClick={() => setShowSidebar(false)}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Inicio</Nav.Link>
            <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Catálogo</Nav.Link>
            <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Contacto</Nav.Link>
            <Nav.Link href="#" style={{ padding: '10px 15px', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee' }}>Nosotros</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Formulario de Login */}
      <Container style={{ paddingTop: '40px', position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card style={{
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
              <Card.Body style={{ padding: '2rem' }}>
                <h2 style={{
                  fontSize: '1.8rem',
                  color: '#333',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>Iniciar Sesión</h2>
                
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group style={{ marginBottom: '1rem' }}>
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '5px',
                        padding: '10px 15px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: '1rem' }}>
                    <Form.Label>Contraseña</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                          borderRadius: '5px',
                          padding: '10px 15px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <Button
                        variant="link"
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#666',
                          padding: 0
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        {formData.showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <FormCheck
                      type="checkbox"
                      id="remember"
                      name="remember"
                      label="Recordar"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <Button variant="link" style={{ padding: 0, color: '#666', textDecoration: 'none' }}>Mostrar</Button>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    Al continuar, usted acepta los Términos de uso y la Política de privacidad.
                  </p>

                  <hr style={{ margin: '1.5rem 0', borderTop: '1px solid #eee' }} />

                  <Button 
                    variant="primary" 
                    type="submit" 
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontWeight: 600,
                      borderRadius: '5px',
                      backgroundColor: '#007bff',
                      border: 'none',
                      marginBottom: '1rem'
                    }}
                  >
                    Ingresar
                  </Button>

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <a href="/forgot-password" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}>¿Olvidaste tu contraseña?</a>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/registrar');
                      }}
                      style={{
                        display: 'block',
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      ¿No tienes un correo? Regístrate
                    </a>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Ingresar con:</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Button variant="outline-danger" style={{
                        padding: '8px 15px',
                        fontSize: '0.9rem',
                        borderRadius: '5px'
                      }}>
                        <FaGoogle style={{ marginRight: '0.5rem' }} /> Google
                      </Button>
                      <Button variant="outline-primary" style={{
                        padding: '8px 15px',
                        fontSize: '0.9rem',
                        borderRadius: '5px'
                      }}>
                        <FaFacebook style={{ marginRight: '0.5rem' }} /> Facebook
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;