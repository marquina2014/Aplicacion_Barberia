import React, { useState, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ListaVentas from '../components/ventas/ListaVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';
import { getVentas, createVenta, getVendedores, getFormulas } from '../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../utils/sesionUsuario';
import { exportarVentasExcel } from '../utils/exportarExcel';
import { getLocalDateISO } from '../utils/dateUtils';
import { FORMULA_INICIAL, obtenerFormulaActiva, calcularMontoFinal } from '../utils/formulasUtils';

/**
 * Vista: VentasDia
 * Propósito: Muestra únicamente las ventas de la jornada actual con Monto Original y Monto Final.
 */
const VentasDia = () => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);
  const vendedorInicial = esAdmin ? '' : usuario.nombre;
  const hoyISO = getLocalDateISO();

  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initFilters = {
    vendedor: vendedorInicial,
    cliente: '',
    servicio: '',
    pago: ''
  };
  const [filters, setFilters] = useState(initFilters);
  const [ventas, setVentas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [formulaActiva, setFormulaActiva] = useState(FORMULA_INICIAL);

  const cargarDatos = async () => {
    const [listaVentas, listaVendedores, listaFormulas] = await Promise.all([
      getVentas(), getVendedores(), getFormulas()
    ]);
    setVentas(listaVentas);
    setVendedores(listaVendedores.map((v) => v.nombres));
    setFormulaActiva(obtenerFormulaActiva(listaFormulas));
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleFilterChange = (field, val) => {
    if (field === 'vendedor' && !esAdmin) return;
    setFilters((prev) => ({ ...prev, [field]: val }));
  };
  const handleReset = () =>
    setFilters({ ...initFilters, vendedor: esAdmin ? '' : usuario.nombre });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await cargarDatos();
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleSaveVenta = async (nv) => {
    const creada = await createVenta(nv);
    setVentas((prev) => [creada, ...prev]);
  };

  const cumpleFiltro = (v) => {
    const esDeHoy = v.fechaISO === hoyISO || String(v.fechaHora || '').startsWith('Hoy');
    if (!esDeHoy) return false;
    if (filters.vendedor && (v.vendedor || '').toLowerCase() !== filters.vendedor.toLowerCase()) return false;
    if (filters.cliente && !(v.cliente || '').toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.servicio && (v.servicio || '').toLowerCase() !== filters.servicio.toLowerCase()) return false;
    if (filters.pago && (v.pago || '').toLowerCase() !== filters.pago.toLowerCase()) return false;
    return true;
  };

  const filtered = ventas.filter(cumpleFiltro);
  const totalMonto = filtered.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  const totalFinal = filtered.reduce((acc, curr) => acc + calcularMontoFinal(curr.monto, formulaActiva), 0);
  const visibles = filtered.slice(0, 30);

  const handleExportar = async () => {
    const todas = await getVentas();
    exportarVentasExcel(todas.filter(cumpleFiltro), 'Ventas_Del_Dia_Legendario', formulaActiva);
  };

  return (
    <MainLayout title="Ventas del Día" subtitle="Métricas y facturación de la jornada en curso">
      <BarraFiltrosVentas
        modo="dia"
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh}
        isRefreshing={isRefreshing} onNuevaVenta={() => setShowModal(true)}
        onExportExcel={handleExportar}
        vendedores={vendedores.length ? vendedores : undefined}
        vendedorDisabled={!esAdmin}
      />

      <Row className="g-3 mb-3">
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Monto Original Hoy</small>
            <h3 className="fw-bold text-white m-0">${totalMonto.toFixed(2)}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Monto Final (Barbero)</small>
            <h3 className="fw-bold text-gold-accent m-0">${totalFinal.toFixed(2)}</h3>
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
            <small className="text-secondary-custom d-block mb-1">Barbero Destacado</small>
            <h4 className="fw-bold text-gold-accent m-0 fs-5">{filtered[0]?.vendedor || usuario.nombre}</h4>
          </div>
        </Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span className="small text-secondary-custom">
          Mostrando <strong className="text-white">{visibles.length}</strong> de <strong className="text-white">{filtered.length}</strong> registro(s)
        </span>
        <div className="d-flex gap-2">
          <Badge bg="dark" className="badge-pill-custom fs-6">Original: <span className="text-white fw-bold">${totalMonto.toFixed(2)}</span></Badge>
          <Badge bg="dark" className="badge-pill-custom fs-6">Final: <span className="text-white fw-bold">${totalFinal.toFixed(2)}</span></Badge>
        </div>
      </div>

      <ListaVentas ventas={visibles} formula={formulaActiva} />

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={handleSaveVenta} />
    </MainLayout>
  );
};

export default VentasDia;
