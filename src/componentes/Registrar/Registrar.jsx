"use client"

import { useState, useEffect } from "react"

const Registrar = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    distrito: "",
    codigopostal: "",
    telefono: "",
    email: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const [focusedField, setFocusedField] = useState("")
  const [titleText, setTitleText] = useState("")
  const [particles, setParticles] = useState([])

  // Animación de typing para el título
  useEffect(() => {
    const text = "Crear Cuenta"
    let index = 0
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTitleText(text.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 150)
    return () => clearInterval(timer)
  }, [])

  // Generar partículas animadas
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  const validationRules = {
    nombre: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      minLength: 2,
      maxLength: 50,
      message: "El nombre debe contener solo letras y espacios (2-50 caracteres)",
    },
    apellido: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      minLength: 2,
      maxLength: 50,
      message: "El apellido debe contener solo letras y espacios (2-50 caracteres)",
    },
    username: {
      pattern: /^[a-zA-Z0-9._-]+$/,
      minLength: 3,
      maxLength: 20,
      message: "El username debe contener solo letras, números, puntos, guiones y guiones bajos (3-20 caracteres)",
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Ingrese un email válido con dominio (ejemplo: usuario@dominio.com)",
    },
    telefono: {
      pattern: /^\d{9}$/,
      message: "El teléfono debe contener exactamente 9 dígitos numéricos",
    },
    password: {
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos",
    },
    direccion: {
      pattern: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/,
      minLength: 5,
      maxLength: 100,
      message: "La dirección debe contener solo letras, números y caracteres básicos (5-100 caracteres)",
    },
    ciudad: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      minLength: 2,
      maxLength: 50,
      message: "La ciudad debe contener solo letras y espacios (2-50 caracteres)",
    },
    provincia: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      minLength: 2,
      maxLength: 50,
      message: "La provincia debe contener solo letras y espacios (2-50 caracteres)",
    },
    distrito: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      minLength: 2,
      maxLength: 50,
      message: "El distrito debe contener solo letras y espacios (2-50 caracteres)",
    },
    codigopostal: {
      pattern: /^\d{5}$/,
      message: "El código postal debe contener exactamente 5 dígitos",
    },
  }

  const validateField = (name, value) => {
    const rule = validationRules[name]
    if (!rule) return ""

    if (value.trim() === "") {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} es requerido`
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message
    }

    return ""
  }

  // 🔧 ARREGLO: Validación mejorada de contraseñas
  const validatePasswords = () => {
    const { password, confirmPassword } = formData

    // Validar que ambas contraseñas estén presentes
    if (!password || !confirmPassword) {
      return ""
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden"
    }

    return ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validar campo individual
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))

    // 🔧 ARREGLO: Validación mejorada de contraseñas en tiempo real
    if (name === "password" || name === "confirmPassword") {
      // Crear un objeto temporal con el nuevo valor
      const tempFormData = { ...formData, [name]: value }

      // Solo validar coincidencia si ambos campos tienen contenido
      if (tempFormData.password && tempFormData.confirmPassword) {
        const passwordError =
          tempFormData.password !== tempFormData.confirmPassword ? "Las contraseñas no coinciden" : ""
        setErrors((prev) => ({ ...prev, confirmPassword: passwordError }))
      } else {
        // Limpiar error de confirmación si uno de los campos está vacío
        setErrors((prev) => ({ ...prev, confirmPassword: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validar todos los campos excepto confirmPassword
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        const error = validateField(key, formData[key])
        if (error) {
          newErrors[key] = error
          isValid = false
        }
      }
    })

    // Validar coincidencia de contraseñas
    const passwordError = validatePasswords()
    if (passwordError) {
      newErrors.confirmPassword = passwordError
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError("")

    if (!validateForm()) {
      alert("Por favor, corrija los errores en el formulario")
      return
    }

    setIsSubmitting(true)

    const usuario = {
      username: formData.username,
      password: formData.password,
      nombre: formData.nombre,
      apellidos: formData.apellido,
      direccion: formData.direccion,
      ciudad: formData.ciudad, // Puedes cambiar esto según tu lógica
      provincia: formData.provincia,
      distrito: formData.distrito,
      codigopostal: formData.codigopostal,
      telefono: `${formData.telefono}`,
      email: formData.email,
      estado: true,
      perfil: "foto.png",
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setGeneralError(errorData?.message || "Error al registrar usuario.")
        alert("Ocurrió un error al registrar el usuario")
        return
      }

      alert("Usuario registrado con éxito")

      // 🔧 ARREGLO: Limpiar formulario después del registro exitoso
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        nombre: "",
        apellido: "",
        direccion: "",
        ciudad: "",
        provincia: "",
        distrito: "",
        codigopostal: "",
        telefono: "",
        email: "",
      })
      setErrors({})
    } catch (error) {
      console.error("Error de red:", error)
      setGeneralError("Error de red al registrar usuario.")
      alert("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField("")
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    particlesContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 1,
    },
    particle: (particle) => ({
      position: "absolute",
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: "rgba(255, 255, 255, 0.6)",
      borderRadius: "50%",
      animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s alternate, glow 2s ease-in-out infinite`,
    }),
    header: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "1rem 0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      animation: "slideDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButton: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "none",
      border: "none",
      color: "#666",
      fontSize: "1rem",
      cursor: "pointer",
      padding: "0.75rem 1.5rem",
      borderRadius: "12px",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      position: "relative",
      overflow: "hidden",
    },
    brandTitle: {
      fontSize: "2.2rem",
      fontWeight: "900",
      background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      letterSpacing: "3px",
      animation: "pulse 2s ease-in-out infinite, rainbow 3s ease-in-out infinite",
    },
    formWrapper: {
      padding: "2rem",
      position: "relative",
      zIndex: 2,
      animation: "fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    formContainer: {
      maxWidth: "900px",
      margin: "0 auto",
    },
    formCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(30px)",
      borderRadius: "28px",
      padding: "3rem",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      position: "relative",
      overflow: "hidden",
      animation: "cardEntrance 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "3rem",
      position: "relative",
    },
    formTitle: {
      fontSize: "3rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "0.5rem",
      minHeight: "4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formSubtitle: {
      color: "#666",
      fontSize: "1.2rem",
      animation: "slideInUp 0.8s ease-out 0.5s both",
    },
    errorAlert: {
      background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
      color: "white",
      padding: "1.2rem 2rem",
      borderRadius: "16px",
      marginBottom: "2rem",
      fontWeight: "600",
      animation: "errorShake 0.6s ease-in-out, errorPulse 2s ease-in-out infinite",
      boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
    },
    formSection: {
      marginBottom: "3rem",
      animation: "sectionSlide 0.8s ease-out both",
      position: "relative",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "3px solid rgba(102, 126, 234, 0.1)",
      position: "relative",
    },
    sectionIcon: {
      fontSize: "1.8rem",
      padding: "0.75rem",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "iconBounce 2s ease-in-out infinite, iconGlow 3s ease-in-out infinite",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
    },
    sectionTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#333",
      animation: "titleSlide 0.6s ease-out",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
    },
    formGroup: {
      marginBottom: "2rem",
      position: "relative",
    },
    formLabel: {
      display: "block",
      marginBottom: "0.75rem",
      fontWeight: "700",
      color: "#333",
      fontSize: "1rem",
      transition: "all 0.3s ease",
    },
    inputWrapper: (focused, hasError) => ({
      position: "relative",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      transform: focused ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
      filter: focused ? "drop-shadow(0 10px 20px rgba(102, 126, 234, 0.2))" : "none",
    }),
    formInput: (focused, hasError) => ({
      width: "100%",
      padding: "1.25rem 1.5rem",
      border: `3px solid ${hasError ? "#ff6b6b" : focused ? "#667eea" : "#e1e5e9"}`,
      borderRadius: "16px",
      fontSize: "1.1rem",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      background: hasError
        ? "rgba(255, 107, 107, 0.05)"
        : focused
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(15px)",
      boxShadow: focused ? "0 0 0 4px rgba(102, 126, 234, 0.1)" : "none",
      outline: "none",
    }),
    phoneWrapper: (focused, hasError) => ({
      display: "flex",
      alignItems: "center",
      border: `3px solid ${hasError ? "#ff6b6b" : focused ? "#667eea" : "#e1e5e9"}`,
      borderRadius: "16px",
      background: hasError
        ? "rgba(255, 107, 107, 0.05)"
        : focused
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(15px)",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      boxShadow: focused ? "0 0 0 4px rgba(102, 126, 234, 0.1)" : "none",
    }),
    countryCode: {
      padding: "1.25rem 1.5rem",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "white",
      fontWeight: "700",
      borderRadius: "13px 0 0 13px",
      borderRight: "2px solid rgba(255, 255, 255, 0.3)",
      fontSize: "1.1rem",
      animation: "codeGlow 2s ease-in-out infinite",
    },
    phoneInput: {
      border: "none",
      background: "transparent",
      boxShadow: "none",
      borderRadius: "0 13px 13px 0",
      outline: "none",
      fontSize: "1.1rem",
      padding: "1.25rem 1.5rem",
      flex: 1,
    },
    passwordWrapper: {
      position: "relative",
    },
    passwordToggle: {
      position: "absolute",
      right: "1.25rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.4rem",
      padding: "0.5rem",
      borderRadius: "8px",
      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      animation: "toggleFloat 3s ease-in-out infinite",
    },
    errorMessage: {
      display: "block",
      color: "#ff6b6b",
      fontSize: "0.9rem",
      marginTop: "0.75rem",
      fontWeight: "600",
      animation: "errorSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      padding: "0.5rem 1rem",
      background: "rgba(255, 107, 107, 0.1)",
      borderRadius: "8px",
      border: "1px solid rgba(255, 107, 107, 0.2)",
    },
    submitButton: (isSubmitting) => ({
      width: "100%",
      padding: "1.5rem 2rem",
      background: isSubmitting
        ? "linear-gradient(135deg, #999, #666)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      color: "white",
      border: "none",
      borderRadius: "20px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      position: "relative",
      overflow: "hidden",
      marginTop: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      transform: isSubmitting ? "scale(0.98)" : "scale(1)",
      animation: isSubmitting ? "buttonPulse 1.5s ease-in-out infinite" : "buttonGlow 3s ease-in-out infinite",
      boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
    }),
    loadingSpinner: {
      width: "24px",
      height: "24px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTop: "3px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loginLink: {
      textAlign: "center",
      marginTop: "2.5rem",
      color: "#666",
      fontSize: "1.1rem",
      animation: "fadeIn 1s ease-out 1.5s both",
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "700",
      transition: "all 0.3s ease",
      position: "relative",
      padding: "0.25rem 0.5rem",
      borderRadius: "6px",
    },
  }

  // CSS Keyframes como string para inyectar
  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
      50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(102, 126, 234, 0.3); }
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
    @keyframes errorPulse {
      0%, 100% { box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3); }
      50% { box-shadow: 0 8px 35px rgba(255, 107, 107, 0.5); }
    }
    @keyframes sectionSlide {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes iconBounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(0deg); }
      40% { transform: translateY(-8px) rotate(5deg); }
      60% { transform: translateY(-4px) rotate(-5deg); }
    }
    @keyframes iconGlow {
      0%, 100% { box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6), 0 0 40px rgba(102, 126, 234, 0.2); }
    }
    @keyframes titleSlide {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes errorSlide {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes codeGlow {
      0%, 100% { box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2); }
      50% { box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.4); }
    }
    @keyframes toggleFloat {
      0%, 100% { transform: translateY(-50%) scale(1); }
      50% { transform: translateY(-50%) scale(1.1); }
    }
    @keyframes buttonGlow {
      0%, 100% { box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4); }
      50% { box-shadow: 0 15px 45px rgba(102, 126, 234, 0.6), 0 0 50px rgba(240, 147, 251, 0.3); }
    }
    @keyframes buttonPulse {
      0%, 100% { transform: scale(0.98); }
      50% { transform: scale(1); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .form-row { grid-template-columns: 1fr !important; gap: 1rem !important; }
      .form-card { padding: 2rem !important; }
      .form-title { font-size: 2.2rem !important; }
      .brand-title { font-size: 1.8rem !important; }
    }
  `

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Partículas animadas */}
        <div style={styles.particlesContainer}>
          {particles.map((particle) => (
            <div key={particle.id} style={styles.particle(particle)} />
          ))}
        </div>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <button
              style={styles.backButton}
              onClick={() => window.history.back()}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)"
                e.target.style.color = "#667eea"
                e.target.style.transform = "translateX(-5px)"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none"
                e.target.style.color = "#666"
                e.target.style.transform = "translateX(0)"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>←</span>
              Volver
            </button>
            <h1 style={styles.brandTitle} className="brand-title">
              ARMADIRIQUE
            </h1>
            <div style={{ width: "120px" }}></div>
          </div>
        </header>

        {/* Formulario */}
        <div style={styles.formWrapper}>
          <div style={styles.formContainer}>
            <div style={styles.formCard} className="form-card">
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle} className="form-title">
                  {titleText}
                  <span
                    style={{
                      opacity: titleText.length < "Crear Cuenta".length ? 1 : 0,
                      animation: "blink 1s infinite",
                      marginLeft: "2px",
                    }}
                  >
                    |
                  </span>
                </h2>
                <p style={styles.formSubtitle}>Únete a nuestra comunidad de muebles premium</p>
              </div>

              {generalError && <div style={styles.errorAlert}>⚠️ {generalError}</div>}

              <form onSubmit={handleSubmit}>
                {/* Información Personal */}
                <div style={styles.formSection}>
                  <div style={styles.sectionHeader}>
                    <div style={styles.sectionIcon}>👤</div>
                    <h3 style={styles.sectionTitle}>Información Personal</h3>
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nombre *</label>
                      <div style={styles.inputWrapper(focusedField === "nombre", errors.nombre)}>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          onFocus={() => handleFocus("nombre")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "nombre", errors.nombre)}
                          placeholder="Ingresa tu nombre"
                          required
                        />
                      </div>
                      {errors.nombre && <span style={styles.errorMessage}>{errors.nombre}</span>}
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Apellido *</label>
                      <div style={styles.inputWrapper(focusedField === "apellido", errors.apellido)}>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          onFocus={() => handleFocus("apellido")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "apellido", errors.apellido)}
                          placeholder="Ingresa tu apellido"
                          required
                        />
                      </div>
                      {errors.apellido && <span style={styles.errorMessage}>{errors.apellido}</span>}
                    </div>
                  </div>
                </div>

                {/* Información de Cuenta */}
                <div style={styles.formSection}>
                  <div style={styles.sectionHeader}>
                    <div style={styles.sectionIcon}>🔐</div>
                    <h3 style={styles.sectionTitle}>Información de Cuenta</h3>
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nombre de Usuario *</label>
                      <div style={styles.inputWrapper(focusedField === "username", errors.username)}>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          onFocus={() => handleFocus("username")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "username", errors.username)}
                          placeholder="Elige un nombre de usuario"
                          required
                        />
                      </div>
                      {errors.username && <span style={styles.errorMessage}>{errors.username}</span>}
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email *</label>
                      <div style={styles.inputWrapper(focusedField === "email", errors.email)}>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "email", errors.email)}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                      {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
                    </div>
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Contraseña *</label>
                      <div style={styles.inputWrapper(focusedField === "password", errors.password)}>
                        <div style={styles.passwordWrapper}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => handleFocus("password")}
                            onBlur={handleBlur}
                            style={styles.formInput(focusedField === "password", errors.password)}
                            placeholder="Crea una contraseña segura"
                            required
                          />
                          <button
                            type="button"
                            style={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseEnter={(e) => {
                              e.target.style.background = "rgba(102, 126, 234, 0.1)"
                              e.target.style.color = "#667eea"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "none"
                              e.target.style.color = "#666"
                            }}
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>
                      {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Confirmar Contraseña *</label>
                      <div style={styles.inputWrapper(focusedField === "confirmPassword", errors.confirmPassword)}>
                        <div style={styles.passwordWrapper}>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => handleFocus("confirmPassword")}
                            onBlur={handleBlur}
                            style={styles.formInput(focusedField === "confirmPassword", errors.confirmPassword)}
                            placeholder="Repite tu contraseña"
                            required
                          />
                          <button
                            type="button"
                            style={styles.passwordToggle}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseEnter={(e) => {
                              e.target.style.background = "rgba(102, 126, 234, 0.1)"
                              e.target.style.color = "#667eea"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "none"
                              e.target.style.color = "#666"
                            }}
                          >
                            {showConfirmPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>
                      {errors.confirmPassword && <span style={styles.errorMessage}>{errors.confirmPassword}</span>}
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div style={styles.formSection}>
                  <div style={styles.sectionHeader}>
                    <div style={styles.sectionIcon}>📞</div>
                    <h3 style={styles.sectionTitle}>Información de Contacto</h3>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Teléfono *</label>
                    <div style={styles.inputWrapper(focusedField === "telefono", errors.telefono)}>
                      <div style={styles.phoneWrapper(focusedField === "telefono", errors.telefono)}>
                        <div style={styles.countryCode}>+51</div>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          onFocus={() => handleFocus("telefono")}
                          onBlur={handleBlur}
                          style={styles.phoneInput}
                          placeholder="999 888 777"
                          maxLength="9"
                          required
                        />
                      </div>
                    </div>
                    {errors.telefono && <span style={styles.errorMessage}>{errors.telefono}</span>}
                  </div>
                </div>

                {/* Información de Dirección */}
                <div style={styles.formSection}>
                  <div style={styles.sectionHeader}>
                    <div style={styles.sectionIcon}>🏠</div>
                    <h3 style={styles.sectionTitle}>Información de Dirección</h3>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Dirección *</label>
                    <div style={styles.inputWrapper(focusedField === "direccion", errors.direccion)}>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        onFocus={() => handleFocus("direccion")}
                        onBlur={handleBlur}
                        style={styles.formInput(focusedField === "direccion", errors.direccion)}
                        placeholder="Av. Principal 123, Urbanización..."
                        required
                      />
                    </div>
                    {errors.direccion && <span style={styles.errorMessage}>{errors.direccion}</span>}
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Ciudad *</label>
                      <div style={styles.inputWrapper(focusedField === "ciudad", errors.ciudad)}>
                        <input
                          type="text"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          onFocus={() => handleFocus("ciudad")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "ciudad", errors.ciudad)}
                          placeholder="Lima"
                          required
                        />
                      </div>
                      {errors.ciudad && <span style={styles.errorMessage}>{errors.ciudad}</span>}
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Provincia *</label>
                      <div style={styles.inputWrapper(focusedField === "provincia", errors.provincia)}>
                        <input
                          type="text"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          onFocus={() => handleFocus("provincia")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "provincia", errors.provincia)}
                          placeholder="Lima"
                          required
                        />
                      </div>
                      {errors.provincia && <span style={styles.errorMessage}>{errors.provincia}</span>}
                    </div>
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Distrito *</label>
                      <div style={styles.inputWrapper(focusedField === "distrito", errors.distrito)}>
                        <input
                          type="text"
                          name="distrito"
                          value={formData.distrito}
                          onChange={handleChange}
                          onFocus={() => handleFocus("distrito")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "distrito", errors.distrito)}
                          placeholder="San Isidro"
                          required
                        />
                      </div>
                      {errors.distrito && <span style={styles.errorMessage}>{errors.distrito}</span>}
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Código Postal *</label>
                      <div style={styles.inputWrapper(focusedField === "codigopostal", errors.codigopostal)}>
                        <input
                          type="text"
                          name="codigopostal"
                          value={formData.codigopostal}
                          onChange={handleChange}
                          onFocus={() => handleFocus("codigopostal")}
                          onBlur={handleBlur}
                          style={styles.formInput(focusedField === "codigopostal", errors.codigopostal)}
                          placeholder="15036"
                          maxLength="5"
                          required
                        />
                      </div>
                      {errors.codigopostal && <span style={styles.errorMessage}>{errors.codigopostal}</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={styles.submitButton(isSubmitting)}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "scale(1.05) translateY(-3px)"
                      e.target.style.boxShadow = "0 20px 45px rgba(102, 126, 234, 0.6)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "scale(1) translateY(0)"
                      e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)"
                    }
                  }}
                >
                  {isSubmitting && <div style={styles.loadingSpinner}></div>}
                  {isSubmitting ? "Creando cuenta..." : "🚀 Crear Mi Cuenta"}
                </button>

                <div style={styles.loginLink}>
                  ¿Ya tienes una cuenta?{" "}
                  <a
                    href="/login"
                    style={styles.link}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(102, 126, 234, 0.1)"
                      e.target.style.transform = "scale(1.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "none"
                      e.target.style.transform = "scale(1)"
                    }}
                  >
                    Inicia Sesión
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Registrar