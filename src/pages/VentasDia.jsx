import React, { useState } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ListaVentas from '../components/ventas/ListaVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';
import { getLocalDateISO, formatRelativeFechaHora } from '../utils/dateUtils';

/**
 * Vista: VentasDia
 * Propósito: Muestra las ventas de la jornada actual con filtros y botón Nueva Venta ARRIBA,
 * métricas del día y tabla idéntica en estructura a la pantalla de Histórico.
 */
const VentasDia = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const todayISO = getLocalDateISO();

  // Filtros unificados (vendedor, cliente, fechaDesde, fechaHasta)
  const [filters, setFilters] = useState({ vendedor: '', cliente: '', fechaDesde: '', fechaHasta: '' });

  // Lista de ventas del día en curso (sincronizada con la fecha local de hoy)
  const [ventas, setVentas] = useState([
    { id: '#V-201', fechaHora: formatRelativeFechaHora(0, '18:40'), fechaISO: todayISO, vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Combo Legendario', monto: 22.0, pago: 'Zelle' },
    { id: '#V-202', fechaHora: formatRelativeFechaHora(0, '17:10'), fechaISO: todayISO, vendedor: 'Alexander Salazar', cliente: 'José Díaz', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-203', fechaHora: formatRelativeFechaHora(0, '15:30'), fechaISO: todayISO, vendedor: 'Valeria Mendoza', cliente: 'Ricardo Peña', servicio: 'Perfilado Barba', monto: 10.0, pago: 'Pago Móvil' },
    { id: '#V-204', fechaHora: formatRelativeFechaHora(0, '14:15'), fechaISO: todayISO, vendedor: 'Carlos Gómez', cliente: 'Luis Medina', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' }
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

      {/* 4. Lista: tabla en PC y tarjetas en celular */}
      <ListaVentas ventas={filtered} />

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={(nv) => setVentas([nv, ...ventas])} />
    </MainLayout>
  );
};

export default VentasDia;
