import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';

/**
 * Vista: VentasDia
 * Propósito: Muestra las ventas de la jornada actual con filtros y botón Nueva Venta ARRIBA,
 * métricas del día y tabla idéntica en estructura a la pantalla de Histórico.
 */
const VentasDia = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtros unificados (vendedor, cliente, fechaDesde, fechaHasta)
  const [filters, setFilters] = useState({ vendedor: '', cliente: '', fechaDesde: '', fechaHasta: '' });

  // Lista de ventas del día en curso
  const [ventas, setVentas] = useState([
    { id: '#V-201', fechaHora: 'Hoy 18:40', fechaISO: '2026-09-24', vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Combo Legendario', monto: 22.0, pago: 'Zelle' },
    { id: '#V-202', fechaHora: 'Hoy 17:10', fechaISO: '2026-09-24', vendedor: 'Alexander Salazar', cliente: 'José Díaz', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-203', fechaHora: 'Hoy 15:30', fechaISO: '2026-09-24', vendedor: 'Valeria Mendoza', cliente: 'Ricardo Peña', servicio: 'Perfilado Barba', monto: 10.0, pago: 'Pago Móvil' },
    { id: '#V-204', fechaHora: 'Hoy 14:15', fechaISO: '2026-09-24', vendedor: 'Carlos Gómez', cliente: 'Luis Medina', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' }
  ]);

  const handleFilterChange = (field, val) => setFilters((prev) => ({ ...prev, [field]: val }));
  const handleReset = () => setFilters({ vendedor: '', cliente: '', fechaDesde: '', fechaHasta: '' });
  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 500); };

  // Filtrado reactivo idéntico
  const filtered = ventas.filter((v) => {
    if (filters.vendedor && v.vendedor !== filters.vendedor) return false;
    if (filters.cliente && !v.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.fechaDesde && v.fechaISO < filters.fechaDesde) return false;
    if (filters.fechaHasta && v.fechaISO > filters.fechaHasta) return false;
    return true;
  });

  const totalMonto = filtered.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <MainLayout title="Ventas del Día" subtitle="Métricas y facturación de la jornada en curso">
      {/* 1. Barra superior unificada: Filtros y Botón Nueva Venta ARRIBA */}
      <BarraFiltrosVentas
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh}
        isRefreshing={isRefreshing} onNuevaVenta={() => setShowModal(true)}
      />

      {/* 2. Métricas del día */}
      <Row className="g-3 mb-3">
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Total Facturado Hoy</small>
            <h3 className="fw-bold text-white m-0">${totalMonto.toFixed(2)}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Servicios Realizados</small>
            <h3 className="fw-bold text-white m-0">{filtered.length} Cortes</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Ticket Promedio</small>
            <h3 className="fw-bold text-white m-0">${filtered.length ? (totalMonto / filtered.length).toFixed(2) : '0.00'}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Barbero Destacado</small>
            <h4 className="fw-bold text-gold-accent m-0 fs-5">Michael R.</h4>
          </div>
        </Col>
      </Row>

      {/* 3. Resumen y Total */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-secondary-custom">Mostrando <strong className="text-white">{filtered.length}</strong> registro(s)</span>
        <Badge bg="dark" className="badge-pill-custom fs-6">Total: <span className="text-white fw-bold">${totalMonto.toFixed(2)}</span></Badge>
      </div>

      {/* 4. Tabla de datos limpia en negro puro */}
      <div className="table-container-card p-3">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Fecha y Hora</th><th>Vendedor</th><th>Cliente</th><th>Servicio</th><th>Total</th><th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td className="fw-bold text-gold-accent">{v.id}</td><td>{v.fechaHora}</td>
                <td className="fw-semibold text-white"><i className="bi bi-person-badge text-gold-accent me-2"></i>{v.vendedor}</td>
                <td>{v.cliente}</td><td><span className="service-pill">{v.servicio}</span></td>
                <td className="fw-bold text-white">${v.monto.toFixed(2)}</td>
                <td><span className="text-gold-accent small"><i className="bi bi-credit-card me-1"></i>{v.pago}</span></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={(nv) => setVentas([nv, ...ventas])} />
    </MainLayout>
  );
};

export default VentasDia;
