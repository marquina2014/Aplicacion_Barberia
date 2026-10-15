import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import ModalFiltrosMovil from '../common/ModalFiltrosMovil';

/**
 * Componente: BarraFiltrosVendedores
 * Propósito: Barra unificada de filtros para Gestión de Vendedores.
 * - En PC: 5 columnas (Nombre, Usuario, Teléfono, Estado y Acciones).
 * - En Celular: muestra Nombre y Usuario, y menú modal para el resto.
 */
const BarraFiltrosVendedores = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  onNuevoVendedor
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const extraCount = [filters.telefono, filters.edad, filters.estado !== 'activo'].filter(Boolean).length;

  const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  const renderFiltrosExtra = (idPrefix, wrapperClass = '') => (
    <>
      <Form.Group controlId={`${idPrefix}-telefono`} className={wrapperClass}>
        <Form.Label className="small text-secondary-custom fw-semibold">
          <i className="bi bi-telephone text-gold-accent me-1"></i>Teléfono
        </Form.Label>
        <Form.Control
          type="text" className="dark-input" placeholder="Escribir..."
          value={filters.telefono} onChange={(e) => onFilterChange('telefono', e.target.value)}
        />
      </Form.Group>

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
    </>
  );

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button
          className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2"
          onClick={onNuevoVendedor}
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Nuevo Barbero</span>
        </Button>
      </div>

      <div className="dark-card p-3 mb-3">
        <div className="filters-grid-row">
          <Form.Group controlId="fv-nombre">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-person text-gold-accent me-1"></i>Nombre
            </Form.Label>
            <Form.Control
              type="text" className="dark-input" placeholder="Escribir..."
              value={filters.nombre} onChange={(e) => onFilterChange('nombre', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="fv-usuario">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-person-badge text-gold-accent me-1"></i>Usuario
            </Form.Label>
            <Form.Control
              type="text" className="dark-input" placeholder="Escribir..."
              value={filters.usuario} onChange={(e) => onFilterChange('usuario', e.target.value)}
            />
          </Form.Group>

          {renderFiltrosExtra('pc-fv', 'filter-extra-mobile')}

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
        <Form.Group controlId="mov-fv-edad" className="mb-2">
          <Form.Label className="small text-secondary-custom fw-semibold">
            <i className="bi bi-calendar-event text-gold-accent me-1"></i>Edad
          </Form.Label>
          <Form.Control
            type="number" className="dark-input" placeholder="Escribir..."
            value={filters.edad} onChange={(e) => onFilterChange('edad', e.target.value)}
          />
        </Form.Group>
        {renderFiltrosExtra('mov-fv')}
      </ModalFiltrosMovil>
    </div>
  );
};

export default BarraFiltrosVendedores;
