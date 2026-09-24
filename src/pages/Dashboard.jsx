import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

/**
 * Vista: Dashboard
 * Propósito: Panel de inicio con métricas clave y accesos directos.
 * Se eliminó la tarjeta de rendimiento según instrucción (imagen 2).
 */
const Dashboard = () => {
  // Tarjetas métricas del día para la barbería
  const metrics = [
    { title: 'Ventas de Hoy', value: '$420.00', icon: 'bi-cash-stack', detail: '14 servicios realizados' },
    { title: 'Vendedores Activos', value: '4 Barberos', icon: 'bi-scissors', detail: 'Turno completo' },
    { title: 'Clientes Atendidos', value: '18 Clientes', icon: 'bi-people-fill', detail: '3 en espera' },
    { title: 'Ticket Promedio', value: '$23.30', icon: 'bi-graph-up-arrow', detail: '+12% vs ayer' }
  ];

  return (
    <MainLayout title="Panel de Inicio" subtitle="Bienvenido a Legendario Barber Shop">
      {/* 1. Métricas principales en tarjetas oscuras con borde dorado */}
      <Row className="g-3 mb-4">
        {metrics.map((m, idx) => (
          <Col xs={12} sm={6} lg={3} key={idx}>
            <div className="metric-card">
              <div className="d-flex justify-content-between text-gold-accent mb-2">
                <i className={`bi ${m.icon} fs-4`}></i>
                <span className="dot-indicator-gold"></span>
              </div>
              <small className="text-secondary-custom d-block mb-1">{m.title}</small>
              <h3 className="fw-bold text-white mb-1">{m.value}</h3>
              <small className="text-muted-custom" style={{ fontSize: '0.78rem' }}>{m.detail}</small>
            </div>
          </Col>
        ))}
      </Row>

      {/* 2. Accesos directos a las pantallas requeridas */}
      <h5 className="fw-bold text-white mb-3">Acciones Rápidas</h5>
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card className="dark-card p-4 text-center h-100">
            <i className="bi bi-cash-coin fs-1 text-gold-accent mb-2"></i>
            <h5 className="fw-bold text-white">Registrar Nueva Venta</h5>
            <p className="text-secondary-custom small mb-3">Registra cortes, arreglos de barba o productos.</p>
            <Link to="/ventas/nueva" className="btn btn-primary-gradient mt-auto">
              Nueva Venta
            </Link>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="dark-card p-4 text-center h-100">
            <i className="bi bi-scissors fs-1 text-gold-accent mb-2"></i>
            <h5 className="fw-bold text-white">Gestión de Vendedores</h5>
            <p className="text-secondary-custom small mb-3">Administra los barberos, crea nuevos o edita sus datos.</p>
            <Link to="/vendedores" className="btn btn-outline-gold mt-auto">
              Ver Vendedores
            </Link>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="dark-card p-4 text-center h-100">
            <i className="bi bi-people-fill fs-1 text-gold-accent mb-2"></i>
            <h5 className="fw-bold text-white">Gestión de Clientes</h5>
            <p className="text-secondary-custom small mb-3">Consulta el directorio de clientes y su fidelidad.</p>
            <Link to="/clientes" className="btn btn-outline-gold mt-auto">
              Ver Clientes
            </Link>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;
