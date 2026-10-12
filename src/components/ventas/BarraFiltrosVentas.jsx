import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import DarkDatePicker from '../common/DarkDatePicker';
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
 * Componente: BarraFiltrosVentas
 * - En PC: muestra los filtros en cuadrícula de 5 columnas (sin ID Venta ni montos).
 * - En Celular: muestra solo 2 filtros (Vendedor y Cliente) y el botón "Filtros" con el resto.
 */
const BarraFiltrosVentas = ({
  modo = 'dia', filters, onFilterChange, onReset, onRefresh, isRefreshing,
  onNuevaVenta, onExportExcel, vendedores = ['luis marquina', 'Sofia marcano'], vendedorDisabled = false
}) => {
  const [showConfirmExcel, setShowConfirmExcel] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const esHistorico = modo === 'historico';

  const extraCount = [
    esHistorico ? filters.fechaDesde : '',
    esHistorico ? filters.fechaHasta : '',
    filters.servicio,
    filters.pago
  ].filter(Boolean).length;

  const renderFiltrosExtra = (idPrefix, wrapperClass = '') => (
    <>
      {esHistorico && (
        <>
          <Form.Group controlId={`${idPrefix}-desde`} className={wrapperClass}>
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-calendar-event text-gold-accent me-1"></i>Desde</Form.Label>
            <DarkDatePicker id={`${idPrefix}-desde`} value={filters.fechaDesde} max={filters.fechaHasta || undefined} onChange={(e) => onFilterChange('fechaDesde', e.target.value)} />
          </Form.Group>
          <Form.Group controlId={`${idPrefix}-hasta`} className={wrapperClass}>
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-calendar-check text-gold-accent me-1"></i>Hasta</Form.Label>
            <DarkDatePicker id={`${idPrefix}-hasta`} value={filters.fechaHasta} min={filters.fechaDesde || undefined} onChange={(e) => onFilterChange('fechaHasta', e.target.value)} />
          </Form.Group>
        </>
      )}
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
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div className="top-actions-group d-flex flex-wrap align-items-center gap-2">
          {onExportExcel && (
            <Button variant="outline-gold" className="top-action-btn d-flex align-items-center justify-content-center gap-2" onClick={() => setShowConfirmExcel(true)}>
              <i className="bi bi-file-earmark-excel-fill"></i><span>Descargar Excel</span>
            </Button>
          )}
          <Button className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2" onClick={onNuevaVenta}>
            <i className="bi bi-plus-circle-fill"></i><span>Nueva Venta</span>
          </Button>
        </div>
      </div>

      <div className="dark-card p-3 mb-3">
        <div className="filters-grid-row">
          <Form.Group controlId="filtro-vendedor">
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-scissors text-gold-accent me-1"></i>Vendedor</Form.Label>
            <DarkSelect id="filtro-vendedor" value={filters.vendedor} disabled={vendedorDisabled} placeholder="Buscar..." onChange={(e) => onFilterChange('vendedor', e.target.value)} options={[{ value: '', label: 'Buscar...' }, ...vendedores.map((v) => ({ value: v, label: v }))]} />
          </Form.Group>
          <Form.Group controlId="filtro-cliente">
            <Form.Label className="small text-secondary-custom fw-semibold"><i className="bi bi-person text-gold-accent me-1"></i>Cliente</Form.Label>
            <Form.Control type="text" className="dark-input" placeholder="Escribir..." value={filters.cliente} onChange={(e) => onFilterChange('cliente', e.target.value)} />
          </Form.Group>

          {renderFiltrosExtra('pc', 'filter-extra-mobile')}

          {esHistorico && (
            <>
              <div className="d-none d-lg-block" aria-hidden="true" />
              <div className="d-none d-lg-block" aria-hidden="true" />
              <div className="d-none d-lg-block" aria-hidden="true" />
            </>
          )}

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
        {renderFiltrosExtra('mov')}
      </ModalFiltrosMovil>

      <Modal show={showConfirmExcel} onHide={() => setShowConfirmExcel(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5"><i className="bi bi-file-earmark-excel-fill text-gold-accent me-2"></i>Confirmar Descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3"><i className="bi bi-file-earmark-spreadsheet text-gold-accent" style={{ fontSize: '3rem' }}></i></div>
          <h6 className="text-white fw-bold mb-2">¿Deseas descargar el reporte en formato Excel (.xlsx)?</h6>
          <p className="small text-secondary-custom m-0">Se descargará toda la información que coincida con los filtros aplicados.</p>
        </Modal.Body>
        <Modal.Footer className="border-gold">
          <Button variant="secondary" onClick={() => setShowConfirmExcel(false)}>No, Cancelar</Button>
          <Button className="btn-primary-gradient px-4" onClick={() => { setShowConfirmExcel(false); onExportExcel(); }}><i className="bi bi-download me-2"></i>Sí, Descargar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarraFiltrosVentas;
