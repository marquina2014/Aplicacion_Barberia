import React from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import DarkSelect from '../common/DarkSelect';
import DarkDatePicker from '../common/DarkDatePicker';

/**
 * Componente: BarraFiltrosVentas
 * Propósito: Barra superior idéntica para todas las pantallas de ventas
 * (Ventas del Día e Histórico). Coloca el botón "+ Nueva Venta" en la esquina
 * superior derecha con el mismo tamaño y posición que Nuevo Vendedor y Registrar Cliente.
 * 
 * @param {Object} props
 * @param {Object} props.filters - Estado con vendedor, cliente, fechaDesde, fechaHasta
 * @param {Function} props.onFilterChange - Manejador para actualizar filtros
 * @param {Function} props.onReset - Limpia todos los filtros (papelera)
 * @param {Function} props.onRefresh - Refresca la tabla (refresh)
 * @param {boolean} props.isRefreshing - Animación de carga para refresh
 * @param {Function} props.onNuevaVenta - Abre el modal para registrar nueva venta
 * @param {Array<string>} [props.vendedores] - Lista de barberos para el selector
 */
const BarraFiltrosVentas = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  onNuevaVenta,
  vendedores = ['Michael Rodríguez', 'Alexander Salazar', 'Valeria Mendoza', 'Carlos Gómez']
}) => {
  return (
    <div className="mb-4">
      {/* 1. Barra superior: Búsqueda y Botón Nueva Venta en la esquina superior derecha */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <InputGroup style={{ maxWidth: '340px' }}>
          <InputGroup.Text className="text-gold-accent">
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            className="dark-input"
            placeholder="Buscar por cliente..."
            value={filters.cliente}
            onChange={(e) => onFilterChange('cliente', e.target.value)}
          />
        </InputGroup>

        <Button
          className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2"
          onClick={onNuevaVenta}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Nueva Venta</span>
        </Button>
      </div>

      {/* 2. Tarjeta con filtros secundarios: todos los inputs con el mismo ancho (md={3}) */}
      <div className="dark-card p-3 mb-3">
        <Row className="g-3 align-items-end">
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="filtro-vendedor">
              <Form.Label className="small text-secondary-custom fw-semibold mb-1">
                <i className="bi bi-scissors text-gold-accent me-1"></i>Vendedor
              </Form.Label>
              <DarkSelect
                value={filters.vendedor}
                onChange={(e) => onFilterChange('vendedor', e.target.value)}
                options={[{ value: '', label: 'Todos los Vendedores' }, ...vendedores.map((v) => ({ value: v, label: v }))]}
              />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="filtro-desde">
              <Form.Label className="small text-secondary-custom fw-semibold mb-1">
                <i className="bi bi-calendar-event text-gold-accent me-1"></i>Desde
              </Form.Label>
              <DarkDatePicker
                id="filtro-desde"
                value={filters.fechaDesde}
                max={filters.fechaHasta || undefined}
                onChange={(e) => onFilterChange('fechaDesde', e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="filtro-hasta">
              <Form.Label className="small text-secondary-custom fw-semibold mb-1">
                <i className="bi bi-calendar-check text-gold-accent me-1"></i>Hasta
              </Form.Label>
              <DarkDatePicker
                id="filtro-hasta"
                value={filters.fechaHasta}
                min={filters.fechaDesde || undefined}
                onChange={(e) => onFilterChange('fechaHasta', e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3} className="d-flex gap-2">
            <Button
              variant="outline-danger"
              className="filter-action-btn w-50"
              onClick={onReset}
              title="Limpiar filtros"
            >
              <i className="bi bi-trash3-fill"></i>
            </Button>
            <Button
              variant="outline-gold"
              className="filter-action-btn w-50"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refrescar tabla"
            >
              <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin-animation' : ''}`}></i>
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BarraFiltrosVentas;
