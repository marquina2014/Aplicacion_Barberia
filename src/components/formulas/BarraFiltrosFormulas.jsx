import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import DarkDatePicker from '../common/DarkDatePicker';
import ModalFiltrosMovil from '../common/ModalFiltrosMovil';

const ESTADO_OPTS = [
  { value: '', label: 'Buscar...' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' }
];

/**
 * Componente: BarraFiltrosFormulas
 * Propósito: Barra unificada de filtros para la pantalla de Fórmulas.
 * - En PC: 5 columnas del mismo tamaño (Nombre, Pasos, Fecha Creación, Estado y Acciones).
 * - En Celular: muestra 2 filtros (Nombre y Pasos) y menú modal para Fecha Creación y Estado.
 */
const BarraFiltrosFormulas = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  onNuevaFormula
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const extraCount = [filters.fechaCreacion, filters.estado].filter(Boolean).length;

  const renderFiltrosExtra = (idPrefix, wrapperClass = '') => (
    <>
      <Form.Group controlId={`${idPrefix}-fecha`} className={wrapperClass}>
        <Form.Label className="small text-secondary-custom fw-semibold">
          <i className="bi bi-calendar-event text-gold-accent me-1"></i>Fecha Creación
        </Form.Label>
        <DarkDatePicker
          id={`${idPrefix}-fecha`}
          value={filters.fechaCreacion}
          onChange={(e) => onFilterChange('fechaCreacion', e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId={`${idPrefix}-estado`} className={wrapperClass}>
        <Form.Label className="small text-secondary-custom fw-semibold">
          <i className="bi bi-shield-check text-gold-accent me-1"></i>Estado
        </Form.Label>
        <DarkSelect
          id={`${idPrefix}-estado`}
          value={filters.estado}
          placeholder="Buscar..."
          onChange={(e) => onFilterChange('estado', e.target.value)}
          options={ESTADO_OPTS}
        />
      </Form.Group>
    </>
  );

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button
          className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2"
          onClick={onNuevaFormula}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Nueva Fórmula</span>
        </Button>
      </div>

      <div className="dark-card p-3 mb-3">
        <div className="filters-grid-row">
          <Form.Group controlId="ff-nombre">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-calculator text-gold-accent me-1"></i>Nombre
            </Form.Label>
            <Form.Control
              type="text" className="dark-input" placeholder="Escribir..."
              value={filters.nombre} onChange={(e) => onFilterChange('nombre', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="ff-pasos">
            <Form.Label className="small text-secondary-custom fw-semibold">
              <i className="bi bi-diagram-3 text-gold-accent me-1"></i>Pasos
            </Form.Label>
            <Form.Control
              type="number" className="dark-input" placeholder="Escribir..."
              value={filters.pasos} onChange={(e) => onFilterChange('pasos', e.target.value)}
            />
          </Form.Group>

          {renderFiltrosExtra('pc-ff', 'filter-extra-mobile')}

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
        {renderFiltrosExtra('mov-ff')}
      </ModalFiltrosMovil>
    </div>
  );
};

export default BarraFiltrosFormulas;
