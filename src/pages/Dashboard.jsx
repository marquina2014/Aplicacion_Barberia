import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';
import { createVenta } from '../services/api';
import { esAdministrador } from '../utils/sesionUsuario';

/**
 * Vista: Dashboard
 * Propósito: Panel de inicio con métricas clave y accesos directos según el rol del usuario.
 */
const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const esAdmin = esAdministrador();

  const metrics = [
    { title: 'Ventas de Hoy', value: '$65.00', icon: 'bi-cash-stack', detail: 'Jornada activa (4 servicios)' },
    { title: 'Barberos Activos', value: '1 Barbero', icon: 'bi-scissors', detail: 'Turno activo' },
    { title: 'Clientes Registrados', value: '13 Clientes', icon: 'bi-people-fill', detail: 'Directorio activo' },
    { title: 'Ticket Promedio', value: '$16.25', icon: 'bi-graph-up-arrow', detail: 'Promedio del día' }
  ];

  return (
    <MainLayout title="Panel de Inicio" subtitle="Bienvenido a Legendario Barber Shop">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-white mb-0">Resumen Operativo</h5>
          <small className="text-secondary-custom">Métricas clave en tiempo real de Legendario</small>
        </div>

        <Button
          className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Nueva Venta</span>
        </Button>
      </div>

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

      <h5 className="fw-bold text-white mb-3">Acciones Rápidas</h5>
      <Row className="g-3">
        <Col xs={12} md={esAdmin ? 4 : 6}>
          <Card className="dark-card p-4 text-center h-100">
            <i className="bi bi-calendar2-day-fill fs-1 text-gold-accent mb-2"></i>
            <h5 className="fw-bold text-white">Ventas del Día</h5>
            <p className="text-secondary-custom small mb-3">Métricas de la jornada, filtros y registro de ventas.</p>
            <Link to="/ventas-dia" className="btn btn-primary-gradient mt-auto">
              Ver Ventas del Día
            </Link>
          </Card>
        </Col>

        {esAdmin ? (
          <>
            <Col xs={12} md={4}>
              <Card className="dark-card p-4 text-center h-100">
                <i className="bi bi-scissors fs-1 text-gold-accent mb-2"></i>
                <h5 className="fw-bold text-white">Gestión de Barberos</h5>
                <p className="text-secondary-custom small mb-3">Administra los barberos, crea nuevos o edita sus datos.</p>
                <Link to="/vendedores" className="btn btn-outline-gold mt-auto">
                  Ver Barberos
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
          </>
        ) : (
          <Col xs={12} md={6}>
            <Card className="dark-card p-4 text-center h-100">
              <i className="bi bi-clock-history fs-1 text-gold-accent mb-2"></i>
              <h5 className="fw-bold text-white">Histórico de Ventas</h5>
              <p className="text-secondary-custom small mb-3">Consulta el historial de tus servicios realizados.</p>
              <Link to="/historico" className="btn btn-outline-gold mt-auto">
                Ver Histórico
              </Link>
            </Card>
          </Col>
        )}
      </Row>

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={(nv) => createVenta(nv)} />
    </MainLayout>
  );
};

export default Dashboard;
