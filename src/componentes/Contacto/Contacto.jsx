import { useState } from "react"
import NavbarCliente from "../Cabeceras/NavbarCliente"
import 'bootstrap-icons/font/bootstrap-icons.css';

function Contacto() {
  const [activeTab, setActiveTab] = useState("info")

 
  const datos = {
    name: "Muebleria Armadirique",
    tagline: "Fabricantes por Mayor/Menor",
    description:
      "ARMADIRIQUE nació con la visión de revolucionar la forma en que las personas amueblan sus hogares. Inspirados por la pasión por el diseño, la funcionalidad y la comodidad, somos una mueblería digital líder que combina calidad, estilo y facilidad, eliminando las limitaciones de las tiendas físicas tradicionales.",
    founded: "2023",
    location: "Lima, Perú",
    phone: "+51 987 654 321",
    email: "armadirique@gmail.com",
    fundador: "Carlos Pajuelo",
    socialMedia: {
      instagram: "https://www.instagram.com/armadirique/",
      tiktok: "https://www.tiktok.com/@armadirique?_t=ZM-8v2U9hzYmJz&_r=1",
      whatsapp: "https://wa.me/+51913378799",

    },
  }

  return (
    <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            position: 'relative'
        }}><NavbarCliente/>

    <div
      className="container-fluid h-100 d-flex align-items-center justify-content-center py-4"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="row w-100 h-100">
        <div className="col-12">
          <div className="card shadow-lg h-100">
            <div className="card-header text-center border-bottom pb-3 bg-light">
              <h2 className="card-title fw-bold mb-0">{datos.name}</h2>
              <p className="card-subtitle text-muted mt-2 mb-0">{datos.tagline}</p>
            </div>

            <div className="card-body p-0 d-flex flex-column h-100">
              <ul className="nav nav-tabs nav-fill" id="companyTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => setActiveTab("info")}
                    id="info-tab"
                    type="button"
                    role="tab"
                    aria-controls="info"
                    aria-selected={activeTab === "info"}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Información
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
                    onClick={() => setActiveTab("contact")}
                    id="contact-tab"
                    type="button"
                    role="tab"
                    aria-controls="contact"
                    aria-selected={activeTab === "contact"}
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Contacto
                  </button>
                </li>
              </ul>

              <div className="tab-content flex-grow-1 p-4" id="companyTabsContent">
                <div
                  className={`tab-pane fade h-100 ${activeTab === "info" ? "show active" : ""}`}
                  id="info"
                  role="tabpanel"
                  aria-labelledby="info-tab"
                >
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <div className="text-center mb-5">
                      <i className="bi bi-building display-1 text-primary mb-3"></i>
                      <h3 className="fw-bold mb-4">Sobre Nosotros</h3>
                    </div>

                    <div className="row">
                      <div className="col-lg-8 mx-auto">
                        <p className="lead text-center mb-4">{datos.description}</p>

                        <div className="row text-center mt-5">
                          <div className="col-md-4 mb-3">
                            <div className="card border-0 bg-light h-100">
                              <div className="card-body">
                                <i className="bi bi-calendar-event display-6 text-primary mb-2"></i>
                                <h5 className="card-title">Fundada</h5>
                                <p className="card-text">{datos.founded}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card border-0 bg-light h-100">
                              <div className="card-body">
                                <i className="bi bi-people display-6 text-primary mb-2"></i>
                                <h5 className="card-title">Fundador</h5>
                                <p className="card-text">{datos.fundador}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card border-0 bg-light h-100">
                              <div className="card-body">
                                <i className="bi bi-geo-alt display-6 text-primary mb-2"></i>
                                <h5 className="card-title">Ubicación</h5>
                                <p className="card-text">{datos.location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade h-100 ${activeTab === "contact" ? "show active" : ""}`}
                  id="contact"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <div className="text-center mb-5">
                      <i className="bi bi-envelope display-1 text-primary mb-3"></i>
                      <h3 className="fw-bold mb-4">Información de Contacto</h3>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 mx-auto">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex align-items-center py-3 border-0">
                            <div className="bg-primary rounded-circle p-3 me-3">
                              <i className="bi bi-geo-alt text-white"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">Dirección</h6>
                              <p className="mb-0 text-muted">{datos.location}</p>
                            </div>
                          </div>

                          <div className="list-group-item d-flex align-items-center py-3 border-0">
                            <div className="bg-success rounded-circle p-3 me-3">
                              <i className="bi bi-telephone text-white"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">Teléfono</h6>
                              <p className="mb-0 text-muted">{datos.phone}</p>
                            </div>
                          </div>

                          <div className="list-group-item d-flex align-items-center py-3 border-0">
                            <div className="bg-info rounded-circle p-3 me-3">
                              <i className="bi bi-envelope text-white"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">Email</h6>
                              <p className="mb-0 text-muted">{datos.email}</p>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer border-top pt-4 bg-light">
                <h5 className="text-center mb-4">Síguenos en redes sociales</h5>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <button
                    className="btn btn-outline-danger btn-lg"
                    onClick={() => window.open(datos.socialMedia.instagram, "_blank")}
                    aria-label="Instagram"
                  >
                    <i className="bi bi-instagram me-2"></i>
                    Instagram
                  </button>
                  <button
                    className="btn btn-outline-dark btn-lg"
                    onClick={() => window.open(datos.socialMedia.tiktok, "_blank")}
                    aria-label="Tik Tok"
                  >
                    <i className="bi bi-tiktok me-2"></i>
                    Tik Tok
                  </button>
                  <button
                    className="btn btn-outline-success btn-lg"
                    onClick={() => window.open(datos.socialMedia.whatsapp, "_blank")}
                    aria-label="WhatsApp"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
    </div>
  )
}
export default Contacto