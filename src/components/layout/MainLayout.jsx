import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

/**
 * Componente: MainLayout
 * Propósito: Estructura base unificada y 100% responsiva. En escritorio muestra
 * el menú lateral fijo de 280px; en celulares se colapsa y activa el menú
 * hamburguesa dorado con cajón deslizante (Offcanvas).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Vista interna a renderizar
 * @param {string} props.title - Título de la vista actual
 * @param {string} [props.subtitle] - Descripción breve de la vista
 */
const MainLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* 1. Componente Menú lateral visible en pantallas de escritorio */}
      <SidebarMenu />

      {/* 2. Menú desplegable lateral (Offcanvas) para móviles y tablets */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        className="mobile-sidebar-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-gold p-3">
          <Offcanvas.Title className="text-gold-accent fs-6 fw-bold m-0">Menú Legendario</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-3">
          <SidebarMenu onNavigate={() => setShowMobileMenu(false)} isMobile />
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. Área principal de contenido que se expande al 100% en móvil */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden main-content-wrapper">
        {/* Barra superior con botón hamburguesa en móvil, título y controles */}
        <header className="d-flex justify-content-between align-items-center py-3 px-3 px-md-4 border-bottom border-gold app-header">
          <div className="d-flex align-items-center gap-2">
            {/* Botón hamburguesa visible solo en dispositivos móviles */}
            <Button
              variant="link"
              className="p-0 text-gold-accent d-lg-none border-0 text-decoration-none me-2"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Abrir menú"
            >
              <i className="bi bi-list fs-1 lh-1"></i>
            </Button>

            <div>
              <h4 className="fw-bold text-white m-0 fs-5 fs-md-4">{title}</h4>
              {subtitle && <small className="text-secondary-custom d-none d-sm-block">{subtitle}</small>}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            <div className="badge-pill-custom d-none d-sm-flex align-items-center gap-2">
              <span className="dot-indicator-gold"></span>
              <span className="small fw-bold">Sistema Activo</span>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-sm-inline">Salir</span>
            </Button>
          </div>
        </header>

        {/* Contenido dinámico con scroll independiente */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
