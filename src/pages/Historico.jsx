import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ListaVentas from '../components/ventas/ListaVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';
import { getRelativeDateISO, formatRelativeFechaHora } from '../utils/dateUtils';

/**
 * Vista: Historico (Auditoría Completa de Ventas)
 * Propósito: Registro histórico con diseño, filtros y botón Nueva Venta ARRIBA
 * exactamente idéntico al de Ventas del Día.
 */
const Historico = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtros unificados idénticos
  const [filters, setFilters] = useState({ vendedor: '', cliente: '', fechaDesde: '', fechaHasta: '' });

  // Lista histórica de transacciones (fechas dinámicas relativas al día en curso)
  const [ventas, setVentas] = useState([
    { id: '#V-105', fechaISO: getRelativeDateISO(0), fechaHora: formatRelativeFechaHora(0, '14:20'), vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Combo Legendario', monto: 22.0, pago: 'Zelle' },
    { id: '#V-104', fechaISO: getRelativeDateISO(0), fechaHora: formatRelativeFechaHora(0, '11:30'), vendedor: 'Carlos Gómez', cliente: 'Daniel Morales', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-103', fechaISO: getRelativeDateISO(-1), fechaHora: formatRelativeFechaHora(-1, '18:30'), vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Corte y Barba', monto: 20.0, pago: 'Pago Móvil' },
    { id: '#V-102', fechaISO: getRelativeDateISO(-1), fechaHora: formatRelativeFechaHora(-1, '17:15'), vendedor: 'Alexander Salazar', cliente: 'José Díaz', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-101', fechaISO: getRelativeDateISO(-2), fechaHora: formatRelativeFechaHora(-2, '15:40'), vendedor: 'Valeria Mendoza', cliente: 'Ricardo Peña', servicio: 'Perfilado Barba', monto: 10.0, pago: 'Tarjeta' },
    { id: '#V-100', fechaISO: getRelativeDateISO(-4), fechaHora: formatRelativeFechaHora(-4, '12:10'), vendedor: 'Alexander Salazar', cliente: 'Andrés Castro', servicio: 'Tratamiento Capilar', monto: 12.0, pago: 'Zelle' }
  ]);

  const handleFilterChange = (field, val) => setFilters((prev) => ({ ...prev, [field]: val }));
  const handleReset = () => setFilters({ vendedor: '', cliente: '', fechaDesde: '', fechaHasta: '' });
  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 500); };

  // Filtrado reactivo
  const filtered = ventas.filter((v) => {
    if (filters.vendedor && v.vendedor !== filters.vendedor) return false;
    if (filters.cliente && !v.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.fechaDesde && v.fechaISO < filters.fechaDesde) return false;
    if (filters.fechaHasta && v.fechaISO > filters.fechaHasta) return false;
    return true;
  });

  const totalMonto = filtered.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <MainLayout title="Histórico de Ventas" subtitle="Auditoría cronológica con filtros avanzados">
      {/* 1. Barra superior unificada: Filtros y Botón Nueva Venta ARRIBA */}
      <BarraFiltrosVentas
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh}
        isRefreshing={isRefreshing} onNuevaVenta={() => setShowModal(true)}
      />

      {/* 2. Resumen y Total */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-secondary-custom">Mostrando <strong className="text-white">{filtered.length}</strong> registro(s)</span>
        <Badge bg="dark" className="badge-pill-custom fs-6">Total: <span className="text-white fw-bold">${totalMonto.toFixed(2)}</span></Badge>
      </div>

      {/* 3. Lista: tabla en PC y tarjetas en celular */}
      <ListaVentas ventas={filtered} />

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={(nv) => setVentas([nv, ...ventas])} />
    </MainLayout>
  );
};

export default Historico;
