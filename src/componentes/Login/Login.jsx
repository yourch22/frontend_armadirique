import React, { useState } from 'react';
import { FaBars, FaUser, FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
    showPassword: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const togglePasswordVisibility = () =>
    setFormData({ ...formData, showPassword: !formData.showPassword });

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
          username: formData.username,
          password: formData.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Correo o contraseña incorrectos.');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log("token",data.token);
      console.log("datacompleta",data);
      setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
      
      setTimeout(() => {
        // window.location.href = '/dashboard';
        navigate('/dashboard');
      }, 2000); // Espera 2 segundos antes de redirigir
  
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión.');
    }
  };
  

  return (
    <div className="login-page">
      <header className="header">
        <div className="header-left">
          <FaBars className="icon menu-icon" onClick={toggleSidebar} />
          <h1 className="brand">Armadirique</h1>
        </div>

        <nav className="nav-links">
          <a href="#">Inicio</a>
          <a href="#">Catálogo</a>
          <a href="#">Contacto</a>
          <a href="#">Nosotros</a>
        </nav>

        <div className="header-right">
          <FaUser className="icon" />
          <FaSearch className="icon" />
          <FaShoppingCart className="icon" />
        </div>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <FaTimes className="close-icon" onClick={toggleSidebar} />
        <a href="#">Inicio</a>
        <a href="#">Catálogo</a>
        <a href="#">Contacto</a>
        <a href="#">Nosotros</a>
      </div>

      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-title">Iniciar Sesión</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="input-group">
            <label>Correo o Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="password-input">
              <input
                type={formData.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {successMessage && <p className="success-message">{successMessage}</p>}

              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {formData.showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                <span>{formData.showPassword ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>
          </div>

          <div className="remember-group">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Recordar</label>
          </div>

          <p className="terms-text">
            Al continuar, aceptas los <a href="/terms">Términos de uso</a> y la <a href="/privacy">Política de privacidad</a>.
          </p>

          <button type="submit" className="login-button">Ingresar</button>

          <div className="divider"></div>

          <div className="login-links">
            <a href="/forgot-password"><strong>¿Olvidaste tu contraseña?</strong></a>
            <a href="/register">¿No tienes cuenta? <strong>Regístrate</strong></a>
          </div>

          <div className="social-login">
            <p className="social-title">Ingresar con:</p>
            <div className="social-buttons">
              <a href="/auth/google" className="social-button">
                <FcGoogle className="social-icon" /> Google
              </a>
              <a href="/auth/facebook" className="social-button">
                <FaFacebook className="social-icon" /> Facebook
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
