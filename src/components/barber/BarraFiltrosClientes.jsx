import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import ModalFiltrosMovil from '../common/ModalFiltrosMovil';

/**
 * Componente: BarraFiltrosClientes
 * Propósito: Barra unificada de filtros para Gestión de Clientes.
 * - En PC: 5 columnas del mismo tamaño (Nombre, Teléfono, Estado, espacio y Acciones).
 * - En Celular: muestra 2 filtros (Nombre y Teléfono) y menú modal para Estado.
 */
const BarraFiltrosClientes = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  onNuevoCliente
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const extraCount = [filters.estado !== 'activo'].filter(Boolean).length;

  const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  const renderFiltrosExtra = (idPrefix, wrapperClass = '') => (
    <Form.Group controlId={`${idPrefix}-estado`} className={wrapperClass}>
      <Form.Label className="small text-secondary-custom fw-semibold">
        <i className="bi bi-shield-check text-gold-accent me-1"></i>Estado
      </Form.Label>
      <DarkSelect
        id={`${idPrefix}-estado`} value={filters.estado || 'activo'}
        onChange={(e) => onFilterChange('estado', e.target.value)}
        options={estadoOptions}
      />
    </Form.Group>
  );

  return (
    <div className="mb-4">
      <div className="dark-card p-3 mb-3">
        <div className="filters-grid-row">
          <Form.Group controlId="fc-nombre">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-person text-gold-accent me-1"></i>Nombre
            </Form.Label>
            <Form.Control
              type="text" className="dark-input" placeholder="Escribir..."
              value={filters.nombre} onChange={(e) => onFilterChange('nombre', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="fc-telefono">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-telephone text-gold-accent me-1"></i>Teléfono
            </Form.Label>
            <Form.Control
              type="text" className="dark-input" placeholder="Escribir..."
              value={filters.telefono} onChange={(e) => onFilterChange('telefono', e.target.value)}
            />
          </Form.Group>

          {renderFiltrosExtra('pc-fc', 'filter-extra-mobile')}

          <div className="d-none d-lg-block" aria-hidden="true" />

          <div className="filter-actions-cell d-flex gap-2">
            <Button variant="outline-gold" className="filter-action-btn btn-mobile-filters" onClick={() => setShowMobileFilters(true)} title="Más filtros">
              <i className="bi bi-sliders me-1"></i><span>Filtros{extraCount > 0 ? ` (${extraCount})` : ''}</span>
            </Button>
            <Button variant="outline-danger" className="filter-action-btn flex-fill" onClick={onReset} title="Limpiar filtros">
              <i className="bi bi-trash3-fill"></i>
            </Button>
            <Button variant="outline-gold" className="filter-action-btn flex-fill" onClick={onRefresh} disabled={isRefreshing} title="Refrescar">
              <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin-animation' : ''}`}></i>
            </Button>
          </div>
        </div>
      </div>

      <ModalFiltrosMovil show={showMobileFilters} onHide={() => setShowMobileFilters(false)} onReset={onReset} activeCount={extraCount}>
        {renderFiltrosExtra('mov-fc')}
      </ModalFiltrosMovil>
    </div>
  );
};

export default BarraFiltrosClientes;
