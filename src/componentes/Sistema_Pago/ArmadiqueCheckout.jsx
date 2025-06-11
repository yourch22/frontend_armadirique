import React, { useState, useRef, useEffect } from "react"

// Tipos de datos (comentarios para JSX)
// Product: { id, name, price, quantity, image }
// Customer: { firstName, lastName, email, phone, address, department, district, zipCode }
// Totals: { subtotal, shipping, tax, total }
// PaymentData: { orderNumber, customer, products, totals, paymentMethod, timestamp }
// Location: { lat, lng, address, district, department, zipCode }

// Datos de productos simulados
const initialProducts = [
  {
    id: "1",
    name: "Sofá Moderno Premium",
    price: 2500.0,
    quantity: 1,
    image: "/placeholder.svg?height=70&width=70",
  },
  {
    id: "2",
    name: "Mesa de Centro Elegante",
    price: 800.0,
    quantity: 1,
    image: "/placeholder.svg?height=70&width=70",
  },
  {
    id: "3",
    name: "Puff Elegante",
    price: 450.0,
    quantity: 2,
    image: "/placeholder.svg?height=70&width=70",
  },
]

const ArmadiqueCheckout = () => {
  // Estados principales
  const [products] = useState(initialProducts)
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("yape")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)

  // Estado del formulario
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    district: "",
    zipCode: "",
  })

  // Estado de validación
  const [errors, setErrors] = useState({})

  // Estados del mapa
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const mapContainerRef = useRef(null)
  const paypalContainerRef = useRef(null)

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
    const shipping = subtotal > 1500 ? 0 : 50
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    return { subtotal, shipping, tax, total }
  }

  const totals = calculateTotals()

  // Validación de campos
  const validateField = (fieldName, value) => {
    let error = ""

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = "Solo se permiten letras y espacios"
        } else if (value.length < 2) {
          error = "Debe tener al menos 2 caracteres"
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          error = "Ingrese un email válido con dominio"
        }
        break

      case "phone":
        const phoneRegex = /^[0-9]{9}$/
        if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          error = "El teléfono debe tener exactamente 9 dígitos"
        }
        break

      case "address":
        if (value.length < 10) {
          error = "La dirección debe ser más específica"
        }
        break

      case "zipCode":
        if (!/^[0-9]{5}$/.test(value)) {
          error = "El código postal debe tener 5 dígitos"
        }
        break

      default:
        if (value.trim().length === 0) {
          error = "Este campo es requerido"
        }
    }

    return error
  }

  // Validar todos los campos
  const validateAllFields = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(customer).forEach((fieldName) => {
      const error = validateField(fieldName, customer[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Manejar cambios en el formulario
  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))

    // Validar campo en tiempo real
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  // Manejar cambios en teléfono
  const handlePhoneChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 9)
    handleCustomerChange("phone", numericValue)
  }

  // Enviar datos al servidor Python
  const sendDataToPython = async () => {
    const orderNumber = `ARM-${Date.now().toString().slice(-8)}`

    const dataToSend = {
      orderNumber,
      customer,
      products,
      totals,
      paymentMethod: currentPaymentMethod,
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetch("http://localhost:8000/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentStatus({
          type: "success",
          message: "¡Pago procesado exitosamente! Se ha enviado la boleta por email.",
        })
        setShowInvoiceModal(true)
      } else {
        setPaymentStatus({
          type: "error",
          message: result.message || "Error al procesar el pago",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setPaymentStatus({
        type: "error",
        message: "Error de conexión. Asegúrate de que el servidor Python esté ejecutándose.",
      })
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isProcessing) return

    if (!validateAllFields()) {
      setPaymentStatus({
        type: "error",
        message: "Por favor corrige los errores en el formulario",
      })
      return
    }

    setIsProcessing(true)
    await sendDataToPython()
    setIsProcessing(false)
  }

  // Funciones del mapa
  const searchLocation = async (query) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Peru&limit=5&addressdetails=1`,
    )

    if (!response.ok) throw new Error("Error en la búsqueda")

    const data = await response.json()

    return data.map((item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.display_name.split(",").slice(0, 3).join(","),
      district: item.address?.suburb || item.address?.city_district || item.address?.neighbourhood || "Lima",
      department: item.address?.state || "Lima",
      zipCode: item.address?.postcode || "15001",
    }))
  }

  const handleMapSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchLocation(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Error en búsqueda:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const selectLocation = (location) => {
    setSelectedLocation(location)
  }

  const confirmMapLocation = () => {
    if (!selectedLocation) return

    setCustomer((prev) => ({
      ...prev,
      address: selectedLocation.address,
      district: selectedLocation.district,
      department: selectedLocation.department,
      zipCode: selectedLocation.zipCode,
    }))
    setShowMapModal(false)
  }

  // Inicializar PayPal
  const initializePayPal = () => {
    const container = paypalContainerRef.current
    if (!container) return

    container.innerHTML = ""

    const totalUSD = (totals.total / 3.8).toFixed(2)

    if (typeof window !== "undefined" && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalUSD,
                    currency_code: "USD",
                  },
                  description: "Compra de muebles - Armadirique",
                },
              ],
            }),
          onApprove: (data, actions) =>
            actions.order.capture().then((details) => {
              console.log("Pago exitoso:", details)
              setPaymentStatus({
                type: "success",
                message: `¡Pago PayPal exitoso! Transacción ID: ${details.id}`,
              })
              setShowInvoiceModal(true)
            }),
          onError: (err) => {
            console.error("Error en PayPal:", err)
            setPaymentStatus({
              type: "error",
              message: "Error en el procesamiento de PayPal. Intente nuevamente.",
            })
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 40,
          },
        })
        .render(container)
        .catch((err) => {
          console.error("Error renderizando PayPal:", err)
          container.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>
            Error inicializando PayPal.
          </div>
        `
        })
    }
  }

  // Efecto para PayPal
  useEffect(() => {
    if (currentPaymentMethod === "paypal" && paypalContainerRef.current) {
      setTimeout(initializePayPal, 200)
    }
  }, [currentPaymentMethod])

  // Funciones de descarga
  const handleDownloadPDF = async () => {
    const orderNumber = `ARM-${Date.now().toString().slice(-8)}`
    const dataToSend = {
      orderNumber,
      customer,
      products,
      totals,
      paymentMethod: currentPaymentMethod,
    }

    try {
      const response = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Boleta_Armadirique_${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert("Error al generar el PDF")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión al generar PDF")
    }
  }

  const handleSendEmail = async () => {
    try {
      alert("¡Boleta reenviada exitosamente a su correo electrónico!")
    } catch (error) {
      console.error("Error enviando email:", error)
      alert("Error al enviar el email")
    }
  }

  return (
    <>
      {/* Estilos CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        .light-premium-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%);
          background-size: 400% 400%;
          animation: lightGradientShift 20s ease infinite;
          min-height: 100vh;
        }

        @keyframes lightGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glass-light {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-dark {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
        }

        .card-premium {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 25px;
          border: none;
          overflow: hidden;
          position: relative;
        }

        .card-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-premium:hover::before {
          opacity: 1;
        }

        .card-premium:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
        }

        .payment-option {
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          color: #1e293b;
        }

        .payment-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          transition: left 0.8s;
        }

        .payment-option:hover::before {
          left: 100%;
        }

        .payment-option:hover {
          transform: scale(1.05) rotate(1deg);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
          border-color: #3b82f6;
        }

        .payment-option.active {
          transform: scale(1.08) rotate(-1deg);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
          border-color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .payment-option.active.yape {
          background: linear-gradient(135deg, #722F8E, #9B4BB8);
          border-color: #722F8E;
        }

        .payment-option.active.plin {
          background: linear-gradient(135deg, #0066CC, #3399FF);
          border-color: #0066CC;
        }

        .payment-option.active.paypal {
          background: linear-gradient(135deg, #0070ba, #003087);
          border-color: #0070ba;
        }

        .floating-glow {
          animation: floatGlow 8s ease-in-out infinite;
        }

        @keyframes floatGlow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
          }
          25% { 
            transform: translateY(-15px) rotate(2deg);
            box-shadow: 0 15px 25px rgba(59, 130, 246, 0.4);
          }
          50% { 
            transform: translateY(-10px) rotate(0deg);
            box-shadow: 0 20px 30px rgba(59, 130, 246, 0.5);
          }
          75% { 
            transform: translateY(-5px) rotate(-2deg);
            box-shadow: 0 15px 25px rgba(59, 130, 246, 0.4);
          }
        }

        .slide-in-left {
          animation: slideInLeft 1s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .slide-in-right {
          animation: slideInRight 1s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .fade-in-up {
          animation: fadeInUp 1.2s ease-out;
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .btn-premium {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.7s;
        }

        .btn-premium:hover::before {
          left: 100%;
        }

        .btn-premium:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.6);
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
        }

        .btn-success-premium {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        .btn-success-premium:hover {
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.6);
        }

        .btn-danger-premium {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }

        .btn-danger-premium:hover {
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.6);
        }

        .input-premium {
          transition: all 0.4s ease;
          border-radius: 15px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #1e293b;
          padding: 15px 20px;
        }

        .input-premium.error {
          border-color: #ef4444;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
        }

        .input-premium::placeholder {
          color: rgba(30, 41, 59, 0.6);
        }

        .input-premium:focus {
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
          border-color: #3b82f6;
          outline: none;
          background: rgba(255, 255, 255, 0.95);
        }

        .pulse-blue {
          animation: pulseBlue 4s infinite;
        }

        @keyframes pulseBlue {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8); }
          70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        .gradient-text-blue {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .qr-frame {
          width: 220px;
          height: 220px;
          border: 3px solid #3b82f6;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
          transition: all 0.4s ease;
        }

        .qr-frame:hover {
          transform: scale(1.05) rotate(2deg);
          box-shadow: 0 20px 45px rgba(59, 130, 246, 0.4);
        }

        .qr-frame.yape {
          border-color: #722F8E;
          box-shadow: 0 15px 35px rgba(114, 47, 142, 0.3);
        }

        .qr-frame.plin {
          border-color: #0066CC;
          box-shadow: 0 15px 35px rgba(0, 102, 204, 0.3);
        }

        .qr-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }

        .loading-premium {
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          animation: spinPremium 1.2s linear infinite;
        }

        @keyframes spinPremium {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-notification {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 35px;
          border-radius: 25px;
          text-align: center;
          margin-top: 30px;
          animation: slideInRight 0.8s ease-out;
          box-shadow: 0 20px 45px rgba(16, 185, 129, 0.3);
          border: 2px solid rgba(16, 185, 129, 0.5);
        }

        .error-notification {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 35px;
          border-radius: 25px;
          text-align: center;
          margin-top: 30px;
          animation: slideInRight 0.8s ease-out;
          box-shadow: 0 20px 45px rgba(239, 68, 68, 0.3);
          border: 2px solid rgba(239, 68, 68, 0.5);
        }

        .product-item {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 15px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.4s ease;
          color: #1e293b;
        }

        .product-item:hover {
          transform: translateX(10px) scale(1.02);
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
        }

        .invoice-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInUp 0.4s ease-out;
        }

        .invoice-panel {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 25px;
          padding: 40px;
          max-width: 700px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideInLeft 0.5s ease-out;
          border: 2px solid rgba(59, 130, 246, 0.3);
          color: #1e293b;
        }

        .map-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInUp 0.4s ease-out;
        }

        .map-panel {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 25px;
          padding: 30px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideInLeft 0.5s ease-out;
          border: 2px solid rgba(59, 130, 246, 0.3);
          color: #1e293b;
        }

        .map-container {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid rgba(59, 130, 246, 0.3);
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e293b;
        }

        .location-result {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          padding: 15px;
          margin: 10px 0;
          border: 1px solid rgba(59, 130, 246, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .location-result:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(5px);
        }

        .location-result.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.2);
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          margin: 30px 0;
          border-radius: 1px;
        }

        .icon-glow {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6));
          animation: iconGlow 3s ease-in-out infinite alternate;
        }

        @keyframes iconGlow {
          from { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6)); }
          to { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.9)); }
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 5px;
        }

        .text-blue {
          color: #3b82f6;
        }

        .text-primary-custom {
          color: #1d4ed8;
        }

        .bg-light-premium {
          background: rgba(255, 255, 255, 0.9);
        }

        .border-blue {
          border-color: #3b82f6 !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding-left: 10px;
            padding-right: 10px;
          }
          
          .card-premium {
            margin-bottom: 20px;
          }
          
          .payment-option {
            margin-bottom: 15px;
          }
          
          .btn-premium {
            padding: 15px 25px;
            font-size: 16px;
          }
          
          .floating-glow {
            animation: none;
          }
          
          .qr-frame {
            width: 180px;
            height: 180px;
          }
        }

        @media (max-width: 576px) {
          .qr-frame {
            width: 160px;
            height: 160px;
          }
          
          .invoice-panel, .map-panel {
            padding: 25px;
            margin: 15px;
          }
        }
      `}</style>

      <div className="light-premium-bg">
        {/* Header premium */}
        <nav className="navbar navbar-expand-lg glass-dark sticky-top">
          <div className="container">
            <a className="navbar-brand fw-bold fs-2 text-dark floating-glow" href="#">
              <i className="fas fa-couch me-3 icon-glow"></i>
              <span className="d-none d-sm-inline gradient-text-blue">Armadirique</span>
              <span className="d-inline d-sm-none gradient-text-blue">ARM</span>
            </a>
            <div className="d-flex align-items-center">
              <span className="badge bg-primary text-white me-3 pulse-blue px-4 py-2 fw-bold">
                <i className="fas fa-shield-check me-2"></i>
                <span className="d-none d-sm-inline">PAGO SEGURO</span>
                <span className="d-inline d-sm-none">SEGURO</span>
              </span>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          {/* Título principal */}
          <div className="text-center mb-5">
            <h1 className="display-3 fw-bold text-dark mb-4 floating-glow">
              <i className="fas fa-home me-3 text-blue icon-glow"></i>
              <span className="gradient-text-blue">CHECKOUT MUEBLERÍA</span>
            </h1>
            <p className="lead text-dark opacity-75 fs-4">Experiencia de compra premium para su hogar</p>
            <div className="section-divider"></div>
          </div>

          <div className="row g-4">
            {/* Columna izquierda - Resumen del pedido */}
            <div className="col-xl-4 col-lg-5">
              <div className="card card-premium glass-dark slide-in-left">
                <div
                  className="card-header text-center py-4 border-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                >
                  <h4 className="mb-0 fw-bold text-white">
                    <i className="fas fa-chair me-3"></i>
                    RESUMEN DE COMPRA
                  </h4>
                </div>
                <div className="card-body p-4">
                  {/* Lista de productos */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-4 gradient-text-blue fs-5">MUEBLES SELECCIONADOS</h6>
                    <div>
                      {products.map((product, index) => (
                        <div key={product.id} className="product-item" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="rounded-3 me-3"
                              style={{ width: "70px", height: "70px", objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-2 fw-bold text-dark">{product.name}</h6>
                              <small className="text-blue">Cantidad: {product.quantity}</small>
                              <div className="fw-bold text-primary-custom fs-5 mt-1">
                                S/ {(product.price * product.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-divider"></div>

                  {/* Totales */}
                  <div className="pt-3">
                    <div className="d-flex justify-content-between mb-3 text-dark">
                      <span className="fs-6">Subtotal:</span>
                      <span className="fw-semibold">S/ {totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-dark">
                      <span className="fs-6">Envío:</span>
                      <span className="fw-semibold">
                        {totals.shipping === 0 ? "GRATIS" : `S/ ${totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-dark">
                      <span className="fs-6">IGV (18%):</span>
                      <span className="fw-semibold">S/ {totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="section-divider"></div>
                    <div className="d-flex justify-content-between fw-bold fs-3">
                      <span className="text-dark">TOTAL:</span>
                      <span className="gradient-text-blue">S/ {totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {totals.shipping === 0 && (
                    <div className="alert alert-success mt-4 border-0 bg-success bg-opacity-20 text-dark">
                      <i className="fas fa-truck me-2 text-success"></i>
                      <strong>¡ENVÍO GRATUITO INCLUIDO!</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="col-xl-8 col-lg-7">
              <div className="card card-premium glass-dark slide-in-right">
                <div
                  className="card-header text-center py-4 border-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                >
                  <h4 className="mb-0 fw-bold text-white">
                    <i className="fas fa-clipboard-list me-3"></i>
                    INFORMACIÓN DE ENTREGA Y PAGO
                  </h4>
                </div>
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    {/* Información de contacto */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-primary bg-opacity-20 rounded-circle p-4 me-4">
                          <i className="fas fa-user-tie fa-xl text-blue"></i>
                        </div>
                        <div>
                          <h5 className="mb-2 fw-bold gradient-text-blue">INFORMACIÓN PERSONAL</h5>
                          <small className="text-dark opacity-75">Datos para facturación y contacto</small>
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-blue">NOMBRE(S) *</label>
                          <input
                            type="text"
                            className={`form-control form-control-lg input-premium ${errors.firstName ? "error" : ""}`}
                            value={customer.firstName}
                            onChange={(e) => handleCustomerChange("firstName", e.target.value)}
                            placeholder="Juan Carlos"
                            required
                          />
                          {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-blue">APELLIDO(S) *</label>
                          <input
                            type="text"
                            className={`form-control form-control-lg input-premium ${errors.lastName ? "error" : ""}`}
                            value={customer.lastName}
                            onChange={(e) => handleCustomerChange("lastName", e.target.value)}
                            placeholder="García López"
                            required
                          />
                          {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-blue">EMAIL *</label>
                          <input
                            type="email"
                            className={`form-control form-control-lg input-premium ${errors.email ? "error" : ""}`}
                            value={customer.email}
                            onChange={(e) => handleCustomerChange("email", e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                          />
                          {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-blue">TELÉFONO (9 dígitos) *</label>
                          <input
                            type="tel"
                            className={`form-control form-control-lg input-premium ${errors.phone ? "error" : ""}`}
                            value={customer.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="999888777"
                            maxLength={9}
                            required
                          />
                          {errors.phone && <div className="error-text">{errors.phone}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Dirección de entrega */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-success bg-opacity-20 rounded-circle p-4 me-4">
                          <i className="fas fa-map-marked-alt fa-xl text-success"></i>
                        </div>
                        <div>
                          <h5 className="mb-2 fw-bold gradient-text-blue">DIRECCIÓN DE ENTREGA</h5>
                          <small className="text-dark opacity-75">Ubicación para la entrega de muebles</small>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-bold text-blue">DIRECCIÓN COMPLETA *</label>
                          <div className="d-flex">
                            <input
                              type="text"
                              className={`form-control form-control-lg input-premium ${errors.address ? "error" : ""}`}
                              value={customer.address}
                              onChange={(e) => handleCustomerChange("address", e.target.value)}
                              placeholder="Av. Javier Prado Este 123, San Isidro"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-premium ms-2"
                              onClick={() => setShowMapModal(true)}
                              title="Buscar en mapa"
                            >
                              <i className="fas fa-map-marker-alt"></i>
                            </button>
                          </div>
                          {errors.address && <div className="error-text">{errors.address}</div>}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold text-blue">DEPARTAMENTO *</label>
                          <select
                            className={`form-control form-control-lg input-premium ${errors.department ? "error" : ""}`}
                            value={customer.department}
                            onChange={(e) => handleCustomerChange("department", e.target.value)}
                            required
                          >
                            <option value="">Seleccionar</option>
                            <option value="Lima">Lima</option>
                            <option value="Arequipa">Arequipa</option>
                            <option value="Trujillo">Trujillo</option>
                            <option value="Chiclayo">Chiclayo</option>
                            <option value="Piura">Piura</option>
                            <option value="Cusco">Cusco</option>
                            <option value="Huancayo">Huancayo</option>
                            <option value="Tacna">Tacna</option>
                          </select>
                          {errors.department && <div className="error-text">{errors.department}</div>}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold text-blue">DISTRITO *</label>
                          <input
                            type="text"
                            className={`form-control form-control-lg input-premium ${errors.district ? "error" : ""}`}
                            value={customer.district}
                            onChange={(e) => handleCustomerChange("district", e.target.value)}
                            placeholder="San Isidro"
                            required
                          />
                          {errors.district && <div className="error-text">{errors.district}</div>}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold text-blue">CÓDIGO POSTAL *</label>
                          <input
                            type="text"
                            className={`form-control form-control-lg input-premium ${errors.zipCode ? "error" : ""}`}
                            value={customer.zipCode}
                            onChange={(e) => handleCustomerChange("zipCode", e.target.value)}
                            placeholder="15036"
                            maxLength={5}
                            required
                          />
                          {errors.zipCode && <div className="error-text">{errors.zipCode}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Métodos de pago */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-info bg-opacity-20 rounded-circle p-4 me-4">
                          <i className="fas fa-credit-card fa-xl text-info"></i>
                        </div>
                        <div>
                          <h5 className="mb-2 fw-bold gradient-text-blue">MÉTODO DE PAGO</h5>
                          <small className="text-dark opacity-75">Seleccione su opción preferida</small>
                        </div>
                      </div>

                      {/* Opciones de pago */}
                      <div className="row g-3 mb-5">
                        <div className="col-lg-3 col-md-6">
                          <div
                            className={`payment-option h-100 ${currentPaymentMethod === "yape" ? "active yape" : ""}`}
                            onClick={() => setCurrentPaymentMethod("yape")}
                          >
                            <div className="card-body text-center p-4">
                              <i className="fas fa-mobile-alt fa-3x mb-3 d-block"></i>
                              <h6 className="fw-bold mb-2">YAPE</h6>
                              <small>QR Instantáneo</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div
                            className={`payment-option h-100 ${currentPaymentMethod === "plin" ? "active plin" : ""}`}
                            onClick={() => setCurrentPaymentMethod("plin")}
                          >
                            <div className="card-body text-center p-4">
                              <i className="fas fa-qrcode fa-3x mb-3 d-block"></i>
                              <h6 className="fw-bold mb-2">PLIN</h6>
                              <small>QR Disponible</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div
                            className={`payment-option h-100 ${currentPaymentMethod === "paypal" ? "active paypal" : ""}`}
                            onClick={() => setCurrentPaymentMethod("paypal")}
                          >
                            <div className="card-body text-center p-4">
                              <i className="fab fa-paypal fa-3x mb-3 d-block"></i>
                              <h6 className="fw-bold mb-2">PAYPAL</h6>
                              <small>Pago Express</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div
                            className={`payment-option h-100 ${currentPaymentMethod === "card" ? "active" : ""}`}
                            onClick={() => setCurrentPaymentMethod("card")}
                          >
                            <div className="card-body text-center p-4">
                              <i className="fas fa-credit-card fa-3x mb-3 d-block"></i>
                              <h6 className="fw-bold mb-2">TARJETA</h6>
                              <small>Crédito/Débito</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Formularios de pago */}
                      <div>
                        {currentPaymentMethod === "yape" && (
                          <div className="glass-light rounded-4 p-5 fade-in-up">
                            <h5 className="fw-bold mb-4 text-center gradient-text-blue">
                              <i className="fas fa-mobile-alt me-3"></i>
                              PAGO CON YAPE - DIEGO
                            </h5>
                            <div className="row align-items-center">
                              <div className="col-md-6 text-center mb-4">
                                <div className="qr-frame yape">
                                  <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QRYAPE-ej7EWY1ldSICfKbGYJlfpulbN5Qmuu.png"
                                    alt="QR Code Yape"
                                    className="rounded"
                                  />
                                </div>
                                <p className="mt-4 fw-bold text-purple fs-5">
                                  <i className="fas fa-user me-2"></i>
                                  DIEGO
                                </p>
                              </div>
                              <div className="col-md-6">
                                <div className="bg-light-premium p-4 rounded-4 border border-blue">
                                  <h6 className="fw-bold mb-4 text-blue">INSTRUCCIONES:</h6>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">1</span>
                                    Abre tu app <strong className="text-blue">YAPE</strong>
                                  </div>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">2</span>
                                    Escanea el código QR
                                  </div>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">3</span>
                                    Confirma el monto:{" "}
                                    <strong className="text-primary-custom">S/ {totals.total.toFixed(2)}</strong>
                                  </div>
                                  <div className="text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">4</span>
                                    Completa el pago
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentPaymentMethod === "plin" && (
                          <div className="glass-light rounded-4 p-5 fade-in-up">
                            <h5 className="fw-bold mb-4 text-center gradient-text-blue">
                              <i className="fas fa-qrcode me-3"></i>
                              PAGO CON PLIN - ERICK
                            </h5>
                            <div className="row align-items-center">
                              <div className="col-md-6 text-center mb-4">
                                <div className="qr-frame plin">
                                  <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QRPLIN.jpg-j56KIn3zXNEnwYVY9N8pYYcsgcHeUo.jpeg"
                                    alt="QR Code Plin"
                                    className="rounded"
                                  />
                                </div>
                                <p className="mt-4 fw-bold text-primary fs-5">
                                  <i className="fas fa-user me-2"></i>
                                  ERICK
                                </p>
                              </div>
                              <div className="col-md-6">
                                <div className="bg-light-premium p-4 rounded-4 border border-blue">
                                  <h6 className="fw-bold mb-4 text-blue">INSTRUCCIONES:</h6>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">1</span>
                                    Abre tu app <strong className="text-blue">PLIN</strong>
                                  </div>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">2</span>
                                    Selecciona "Pagar con QR"
                                  </div>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">3</span>
                                    Escanea este código QR
                                  </div>
                                  <div className="mb-3 text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">4</span>
                                    Confirma el monto:{" "}
                                    <strong className="text-primary-custom">S/ {totals.total.toFixed(2)}</strong>
                                  </div>
                                  <div className="text-dark">
                                    <span className="badge bg-primary text-white me-3 fw-bold">5</span>
                                    Completa el pago
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentPaymentMethod === "paypal" && (
                          <div className="glass-light rounded-4 p-5 text-center fade-in-up">
                            <i className="fab fa-paypal fa-5x text-primary mb-4 floating-glow"></i>
                            <h5 className="fw-bold mb-4 gradient-text-blue">PAGO CON PAYPAL</h5>
                            <p className="mb-4 text-dark fs-5">Procesamiento seguro internacional</p>
                            <p className="mb-3 text-muted">
                              Total:{" "}
                              <strong>
                                S/ {totals.total.toFixed(2)} (≈ ${(totals.total / 3.8).toFixed(2)} USD)
                              </strong>
                            </p>
                            <div ref={paypalContainerRef} style={{ maxWidth: "400px", margin: "0 auto" }}></div>
                            <div className="alert alert-info border-0 bg-info bg-opacity-20 mt-3">
                              <i className="fas fa-info-circle me-2"></i>
                              <strong>PAYPAL SANDBOX:</strong> Modo de prueba para desarrollo
                            </div>
                          </div>
                        )}

                        {currentPaymentMethod === "card" && (
                          <div className="glass-light rounded-4 p-5 fade-in-up">
                            <h5 className="fw-bold mb-4 gradient-text-blue">
                              <i className="fas fa-credit-card me-3"></i>
                              INFORMACIÓN DE TARJETA
                            </h5>
                            <div className="row g-3">
                              <div className="col-12">
                                <label className="form-label fw-bold text-blue">NÚMERO DE TARJETA</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-premium"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                />
                              </div>
                              <div className="col-md-8">
                                <label className="form-label fw-bold text-blue">NOMBRE DEL TITULAR</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-premium"
                                  placeholder="Como aparece en la tarjeta"
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label fw-bold text-blue">MM/AA</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-premium"
                                  placeholder="12/25"
                                  maxLength={5}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label fw-bold text-blue">CVV</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-premium"
                                  placeholder="123"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-premium btn-lg px-5 py-4 fw-bold fs-5"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="loading-premium me-3" style={{ width: "25px", height: "25px" }}></div>
                            PROCESANDO...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-home me-3"></i>
                            FINALIZAR COMPRA DE MUEBLES
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Estado del pago */}
                  {paymentStatus && (
                    <div style={{ display: "block", marginTop: "30px" }}>
                      <div className={paymentStatus.type === "success" ? "success-notification" : "error-notification"}>
                        <i
                          className={`${paymentStatus.type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-triangle"} fa-4x mb-4`}
                        ></i>
                        <h4 className="fw-bold mb-3">
                          {paymentStatus.type === "success" ? "¡COMPRA EXITOSA!" : "ERROR EN EL PROCESO"}
                        </h4>
                        <p className="mb-0 fs-5">{paymentStatus.message}</p>
                        {paymentStatus.type === "success" && (
                          <div className="mt-5">
                            <button className="btn btn-success-premium me-3 btn-lg" onClick={handleSendEmail}>
                              <i className="fas fa-envelope me-2"></i>
                              REENVIAR EMAIL
                            </button>
                            <button className="btn btn-danger-premium btn-lg" onClick={handleDownloadPDF}>
                              <i className="fas fa-download me-2"></i>
                              DESCARGAR PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de mapa */}
        {showMapModal && (
          <div className="map-overlay" onClick={(e) => e.target === e.currentTarget && setShowMapModal(false)}>
            <div className="map-panel">
              <div className="text-center mb-4">
                <h4 className="fw-bold gradient-text-blue">
                  <i className="fas fa-map-marker-alt me-3"></i>
                  BUSCAR DIRECCIÓN EN MAPA INTERACTIVO
                </h4>
                <p className="text-dark">Busca tu ubicación o haz clic en el mapa para seleccionar</p>
              </div>

              {/* Buscador */}
              <form onSubmit={handleMapSearch} className="mb-4">
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control form-control-lg input-premium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar dirección, calle, avenida..."
                  />
                  <button type="submit" className="btn btn-premium ms-2" disabled={isSearching}>
                    {isSearching ? (
                      <div className="loading-premium" style={{ width: "20px", height: "20px" }}></div>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}
                  </button>
                </div>
              </form>

              {/* Mapa simulado */}
              <div
                ref={mapContainerRef}
                style={{ height: "400px", borderRadius: "15px", overflow: "hidden", margin: "20px 0" }}
              >
                <div className="text-center d-flex align-items-center justify-content-center h-100 map-container">
                  <div>
                    <i className="fas fa-map fa-3x text-blue mb-3"></i>
                    <p className="text-dark">Mapa interactivo (requiere integración con Leaflet)</p>
                  </div>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-blue mb-3">RESULTADOS DE BÚSQUEDA:</h6>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className={`location-result ${selectedLocation === result ? "selected" : ""}`}
                        onClick={() => selectLocation(result)}
                      >
                        <div className="d-flex align-items-center">
                          <i className="fas fa-map-pin me-3 text-blue"></i>
                          <div>
                            <h6 className="mb-1 text-dark">{result.address}</h6>
                            <small className="text-blue">
                              {result.district}, {result.department} - {result.zipCode}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ubicación seleccionada */}
              {selectedLocation && (
                <div className="mb-4">
                  <h6 className="fw-bold text-blue mb-3">UBICACIÓN SELECCIONADA:</h6>
                  <div className="location-result selected">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle me-3 text-success"></i>
                      <div>
                        <h6 className="mb-1 text-dark">{selectedLocation.address}</h6>
                        <small className="text-blue">
                          {selectedLocation.district}, {selectedLocation.department} - {selectedLocation.zipCode}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instrucciones */}
              <div className="alert alert-info border-0 bg-info bg-opacity-20 mb-4">
                <i className="fas fa-info-circle me-2 text-info"></i>
                <strong>Instrucciones:</strong>
                <ul className="mb-0 mt-2 text-dark">
                  <li>Busca tu dirección en el campo de búsqueda</li>
                  <li>O haz clic directamente en el mapa para seleccionar una ubicación</li>
                  <li>Confirma la dirección seleccionada</li>
                </ul>
              </div>

              {/* Botones */}
              <div className="text-center">
                <button
                  className="btn btn-success-premium me-3 btn-lg"
                  onClick={confirmMapLocation}
                  disabled={!selectedLocation}
                >
                  <i className="fas fa-check me-2"></i>
                  CONFIRMAR DIRECCIÓN
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => setShowMapModal(false)}>
                  <i className="fas fa-times me-2"></i>
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de boleta */}
        {showInvoiceModal && (
          <div className="invoice-overlay" onClick={(e) => e.target === e.currentTarget && setShowInvoiceModal(false)}>
            <div className="invoice-panel">
              <div className="text-center mb-5">
                <h3 className="fw-bold gradient-text-blue">BOLETA DE VENTA MUEBLERÍA</h3>
                <p className="text-blue fs-5">Orden: ARM-{Date.now().toString().slice(-8)}</p>
                <div className="section-divider"></div>
              </div>

              <div className="row mb-5">
                <div className="col-6">
                  <h6 className="fw-bold text-blue">CLIENTE:</h6>
                  <div>
                    <p className="mb-2 text-dark fs-6">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="mb-2 text-dark">{customer.email}</p>
                    <p className="mb-0 text-dark">{customer.phone}</p>
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="fw-bold text-blue">ENTREGA:</h6>
                  <div>
                    <p className="mb-2 text-dark fs-6">{customer.address}</p>
                    <p className="mb-0 text-dark">
                      {customer.district}, {customer.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="table-responsive mb-5">
                <table className="table table-light">
                  <thead>
                    <tr className="border-blue">
                      <th className="text-blue">Mueble</th>
                      <th className="text-blue">Cant.</th>
                      <th className="text-blue">Precio</th>
                      <th className="text-blue">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="text-dark">
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>S/ {product.price.toFixed(2)}</td>
                        <td>S/ {(product.price * product.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-top border-blue pt-4">
                <div className="d-flex justify-content-between mb-2 text-dark">
                  <span>Subtotal:</span>
                  <span>S/ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-dark">
                  <span>Envío:</span>
                  <span>S/ {totals.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-dark">
                  <span>IGV:</span>
                  <span>S/ {totals.tax.toFixed(2)}</span>
                </div>
                <div className="section-divider"></div>
                <div className="d-flex justify-content-between fw-bold fs-3">
                  <span className="text-dark">TOTAL:</span>
                  <span className="gradient-text-blue">S/ {totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center mt-5">
                <button className="btn btn-success-premium me-3 btn-lg" onClick={handleSendEmail}>
                  <i className="fas fa-envelope me-2"></i>
                  ENVIAR EMAIL
                </button>
                <button className="btn btn-danger-premium me-3 btn-lg" onClick={handleDownloadPDF}>
                  <i className="fas fa-download me-2"></i>
                  DESCARGAR PDF
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => setShowInvoiceModal(false)}>
                  CERRAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ArmadiqueCheckout