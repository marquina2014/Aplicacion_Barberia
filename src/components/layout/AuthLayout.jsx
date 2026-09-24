import React from 'react';
import { Card, Container } from 'react-bootstrap';
import BrandLogo from '../common/BrandLogo';

/**
 * Componente: AuthLayout
 * Propósito: Estructura contenedora visual para las pantallas de Login y Register.
 * Proporciona el fondo con luces ambientales de acento, centrado vertical
 * y la tarjeta elevada de vidrio oscuro.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Formulario o contenido interno
 * @param {string} props.title - Título principal de la acción (ej. "Bienvenido de nuevo")
 * @param {string} props.subtitle - Mensaje secundario explicativo
 */
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-wrapper">
      {/* Elementos decorativos de resplandor ambiental (Glows superiores e inferiores) */}
      <div className="auth-ambient-glow" aria-hidden="true"></div>
      <div className="auth-ambient-glow-bottom" aria-hidden="true"></div>

      <Container className="d-flex justify-content-center">
        {/* Tarjeta oscura con elevación suave inspirada en la imagen de referencia */}
        <Card className="dark-card auth-card">
          {/* Cabecera con logotipo de marca */}
          <div className="d-flex justify-content-center mb-4">
            <BrandLogo title="Cofeed Barber" subtitle="Gestión Premium" size="large" />
          </div>

          {/* Títulos y descripción de la vista */}
          <div className="text-center mb-4">
            <h3 className="fw-bold text-white mb-2">{title}</h3>
            {subtitle && (
              <p className="text-secondary-custom small mb-0">{subtitle}</p>
            )}
          </div>

          {/* Contenido inyectado (Formularios de Login o Register) */}
          {children}
        </Card>
      </Container>
    </div>
  );
};

export default AuthLayout;
