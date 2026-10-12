import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import ModalFiltrosMovil from '../common/ModalFiltrosMovil';

const SERVICIOS_OPTS = [
  { value: '', label: 'Buscar...' },
  { value: 'Corte Clásico', label: 'Corte Clásico' },
  { value: 'Perfilado de Barba', label: 'Perfilado de Barba' },
  { value: 'Combo Legendario', label: 'Combo Legendario' },
  { value: 'Tratamiento Capilar', label: 'Tratamiento Capilar' }
];

const PAGOS_OPTS = [
  { value: '', label: 'Buscar...' },
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Pago Móvil', label: 'Pago Móvil' },
  { value: 'Tarjeta', label: 'Tarjeta / Punto' },
  { value: 'Zelle', label: 'Zelle' }
];

/**
 * Componente: BarraFiltrosFormulas
 * Propósito: Barra de filtros de la pantalla de Fórmulas (misma estructura de Ventas del Día)
 * con botones superiores "Descargar Excel" y "Nueva Fórmula".
 */
const BarraFiltrosFormulas = ({
  filters, onFilterChange, onReset, onRefresh, isRefreshing,
  onNuevaFormula, onExportExcel, formulas = [], formulaActivaId, onSelectFormula,
  vendedores = ['luis marquina', 'Sofia marcano'], vendedorDisabled = false
}) => {
  const [showConfirmExcel, setShowConfirmExcel] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const extraCount = [filters.servicio, filters.pago].filter(Boolean).length;

  const renderFiltrosExtra = (idPrefix, wrapperClass = '') => (
    <>
      <Form.Group controlId={`${idPrefix}-servicio`} className={wrapperClass}>
        <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-tag text-gold-accent me-1"></i>Servicio</Form.Label>
        <DarkSelect id={`${idPrefix}-servicio`} value={filters.servicio || ''} placeholder="Buscar..." onChange={(e) => onFilterChange('servicio', e.target.value)} options={SERVICIOS_OPTS} />
      </Form.Group>
      <Form.Group controlId={`${idPrefix}-pago`} className={wrapperClass}>
        <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-credit-card text-gold-accent me-1"></i>Método de Pago</Form.Label>
        <DarkSelect id={`${idPrefix}-pago`} value={filters.pago || ''} placeholder="Buscar..." onChange={(e) => onFilterChange('pago', e.target.value)} options={PAGOS_OPTS} />
      </Form.Group>
    </>
  );

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {formulas.map((f) => (
            <Button
              key={f.id} size="sm"
              variant={f.id === formulaActivaId ? 'primary' : 'outline-gold'}
              className={f.id === formulaActivaId ? 'btn-primary-gradient px-3' : 'px-3'}
              style={{ height: '38px' }}
              onClick={() => onSelectFormula(f)}
            >
              <i className="bi bi-calculator me-1"></i>{f.nombre}
            </Button>
          ))}
        </div>

        <div className="top-actions-group d-flex flex-wrap align-items-center gap-2 ms-auto">
          {onExportExcel && (
            <Button variant="outline-gold" className="top-action-btn d-flex align-items-center justify-content-center gap-2" onClick={() => setShowConfirmExcel(true)}>
              <i className="bi bi-file-earmark-excel-fill"></i><span>Descargar Excel</span>
            </Button>
          )}
          <Button className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2" onClick={onNuevaFormula}>
            <i className="bi bi-plus-circle-fill"></i><span>Nueva Fórmula</span>
          </Button>
        </div>
      </div>

      <div className="dark-card p-3 mb-3">
        <div className="filters-grid-row">
          <Form.Group controlId="ff-vendedor">
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-scissors text-gold-accent me-1"></i>Vendedor</Form.Label>
            <DarkSelect id="ff-vendedor" value={filters.vendedor} disabled={vendedorDisabled} placeholder="Buscar..." onChange={(e) => onFilterChange('vendedor', e.target.value)} options={[{ value: '', label: 'Buscar...' }, ...vendedores.map((v) => ({ value: v, label: v }))]} />
          </Form.Group>
          <Form.Group controlId="ff-cliente">
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-person text-gold-accent me-1"></i>Cliente</Form.Label>
            <Form.Control type="text" className="dark-input" placeholder="Escribir..." value={filters.cliente} onChange={(e) => onFilterChange('cliente', e.target.value)} />
          </Form.Group>

          {renderFiltrosExtra('pc-ff', 'filter-extra-mobile')}

          <div className="filter-actions-cell d-flex gap-2">
            <Button variant="outline-gold" className="filter-action-btn btn-mobile-filters" onClick={() => setShowMobileFilters(true)} title="Más filtros">
              <i className="bi bi-sliders me-1"></i><span>Filtros{extraCount > 0 ? ` (${extraCount})` : ''}</span>
            </Button>
            <Button variant="outline-danger" className="filter-action-btn flex-fill" onClick={onReset} title="Limpiar filtros"><i className="bi bi-trash3-fill"></i></Button>
            <Button variant="outline-gold" className="filter-action-btn flex-fill" onClick={onRefresh} disabled={isRefreshing} title="Refrescar tabla"><i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin-animation' : ''}`}></i></Button>
          </div>
        </div>
      </div>

      <ModalFiltrosMovil show={showMobileFilters} onHide={() => setShowMobileFilters(false)} onReset={onReset} activeCount={extraCount}>
        {renderFiltrosExtra('mov-ff')}
      </ModalFiltrosMovil>

      <Modal show={showConfirmExcel} onHide={() => setShowConfirmExcel(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5"><i className="bi bi-file-earmark-excel-fill text-gold-accent me-2"></i>Confirmar Descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3"><i className="bi bi-file-earmark-spreadsheet text-gold-accent" style={{ fontSize: '3rem' }}></i></div>
          <h6 className="text-white fw-bold mb-2">¿Deseas descargar el reporte en formato Excel (.xlsx)?</h6>
          <p className="small text-secondary-custom m-0">Incluirá las columnas de Monto Original y Monto Final según la fórmula activa.</p>
        </Modal.Body>
        <Modal.Footer className="border-gold">
          <Button variant="secondary" onClick={() => setShowConfirmExcel(false)}>No, Cancelar</Button>
          <Button className="btn-primary-gradient px-4" onClick={() => { setShowConfirmExcel(false); onExportExcel(); }}><i className="bi bi-download me-2"></i>Sí, Descargar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarraFiltrosFormulas;
