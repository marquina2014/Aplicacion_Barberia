import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

/**
 * Componente: MainLayout
 * Propósito: Estructura base unificada con el Menú lateral (Imagen 1)
 * y área de contenido central para todas las pantallas del sistema.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Vista interna a renderizar
 * @param {string} props.title - Título de la vista actual
 * @param {string} [props.subtitle] - Descripción breve de la vista
 */
const MainLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* 1. Componente Menú lateral (primera imagen de referencia) */}
      <SidebarMenu />

      {/* 2. Área principal de contenido */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        {/* Barra superior con título y controles */}
        <header className="d-flex justify-content-between align-items-center py-3 px-4 border-bottom border-gold">
          <div>
            <h4 className="fw-bold text-white m-0">{title}</h4>
            {subtitle && <small className="text-secondary-custom">{subtitle}</small>}
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="badge-pill-custom d-flex align-items-center gap-2">
              <span className="dot-indicator-gold"></span>
              <span className="small fw-bold">Sistema Activo</span>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Salir
            </Button>
          </div>
        </header>

        {/* Contenido dinámico con scroll independiente */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
