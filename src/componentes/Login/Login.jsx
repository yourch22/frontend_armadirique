import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  FaArrowLeft,
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
/*  RUTA PAR ELEGIR LA IMAGEN */
const Login = () => {
  const { login } = useAuth();
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
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
      // Intenta leer el mensaje del error que viene en formato JSON
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Usuario o contraseña incorrectos.';
      throw new Error(message);
    }

    const data = await response.json();
    // localStorage.setItem('token', data.token);
    // Obtener usuario actual
    const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/actual-usuario`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('No se pudo obtener el usuario actual.');
    }

    const user = await userResponse.json();
    const rol = user.authorities[0].authority;
    // localStorage.setItem('userId', user.usuarioId);
  
    login(data.token, user.usuarioId); // <-- esto asegura que el contexto se actualice

    setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');

    setTimeout(() => {
      if (rol === 'ADMIN') {
        navigate('/dashboardadmin');
      } else {
        navigate('/inicio');
        // navigate('/dashboardcliente');
      }
    }, 2000);
  } catch (error) {
    console.error('Error en login:', error);
    setErrorMessage(error.message || 'Error al iniciar sesión.');
  }
};


  return (
    <div style={{

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
                  <Nav.Link href='/inicio'>ARMADIRIQUE</Nav.Link>
                </Navbar.Brand>

                <div style={{ width: '160px' }}></div>
              </Container>
            </Navbar>
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
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
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
                    {/*<p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Ingresar con:</p>*/}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                     {/*  <Button variant="outline-danger" style={{
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
                      </Button> */}
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