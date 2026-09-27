import React, { useState } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';

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

  // Lista histórica de transacciones
  const [ventas, setVentas] = useState([
    { id: '#V-105', fechaISO: '2026-09-24', fechaHora: '24/09/2026 14:20', vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Combo Legendario', monto: 22.0, pago: 'Zelle' },
    { id: '#V-104', fechaISO: '2026-09-24', fechaHora: '24/09/2026 11:30', vendedor: 'Carlos Gómez', cliente: 'Daniel Morales', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-103', fechaISO: '2026-09-23', fechaHora: '23/09/2026 18:30', vendedor: 'Michael Rodríguez', cliente: 'Gabriel Torres', servicio: 'Corte y Barba', monto: 20.0, pago: 'Pago Móvil' },
    { id: '#V-102', fechaISO: '2026-09-23', fechaHora: '23/09/2026 17:15', vendedor: 'Alexander Salazar', cliente: 'José Díaz', servicio: 'Corte Clásico', monto: 15.0, pago: 'Efectivo' },
    { id: '#V-101', fechaISO: '2026-09-22', fechaHora: '22/09/2026 15:40', vendedor: 'Valeria Mendoza', cliente: 'Ricardo Peña', servicio: 'Perfilado Barba', monto: 10.0, pago: 'Tarjeta' },
    { id: '#V-100', fechaISO: '2026-09-20', fechaHora: '20/09/2026 12:10', vendedor: 'Alexander Salazar', cliente: 'Andrés Castro', servicio: 'Tratamiento Capilar', monto: 12.0, pago: 'Zelle' }
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

      {/* 3. Tabla de datos limpia en negro puro */}
      <div className="table-container-card p-3">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Fecha y Hora</th><th>Vendedor</th><th>Cliente</th><th>Servicio</th><th>Total</th><th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((v) => (
                <tr key={v.id}>
                  <td className="fw-bold text-gold-accent">{v.id}</td><td>{v.fechaHora}</td>
                  <td className="fw-semibold text-white"><i className="bi bi-person-badge text-gold-accent me-2"></i>{v.vendedor}</td>
                  <td>{v.cliente}</td><td><span className="service-pill">{v.servicio}</span></td>
                  <td className="fw-bold text-white">${v.monto.toFixed(2)}</td>
                  <td><span className="text-gold-accent small"><i className="bi bi-credit-card me-1"></i>{v.pago}</span></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-4 text-muted-custom">No se encontraron ventas con los filtros aplicados.</td></tr>
            )}
          </tbody>
        </Table>
      </div>

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={(nv) => setVentas([nv, ...ventas])} />
    </MainLayout>
  );
};

export default Historico;
