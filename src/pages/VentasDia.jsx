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
  const origUSD = filtered.filter((v) => v.moneda !== 'Bolívares').reduce((acc, c) => acc + Number(c.monto || 0), 0);
  const finalUSD = filtered.filter((v) => v.moneda !== 'Bolívares').reduce((acc, c) => acc + (c.montoFinal !== undefined ? Number(c.montoFinal) : calcularMontoFinal(c.monto, formulaActiva)), 0);
  const origBS = filtered.filter((v) => v.moneda === 'Bolívares').reduce((acc, c) => acc + Number(c.monto || 0), 0);
  const finalBS = filtered.filter((v) => v.moneda === 'Bolívares').reduce((acc, c) => acc + (c.montoFinal !== undefined ? Number(c.montoFinal) : calcularMontoFinal(c.monto, formulaActiva)), 0);
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
            <small className="text-secondary-custom d-block mb-1">Original en Dólares ($)</small>
            <h3 className="fw-bold text-white m-0">${origUSD.toFixed(2)}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Fórmula Aplicada ($)</small>
            <h3 className="fw-bold text-gold-accent m-0">${finalUSD.toFixed(2)}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Original en Bolívares (Bs)</small>
            <h3 className="fw-bold text-white m-0">Bs. {origBS.toFixed(2)}</h3>
          </div>
        </Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <small className="text-secondary-custom d-block mb-1">Fórmula Aplicada (Bs)</small>
            <h3 className="fw-bold text-gold-accent m-0">Bs. {finalBS.toFixed(2)}</h3>
          </div>
        </Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span className="small text-secondary-custom">
          Mostrando <strong className="text-white">{visibles.length}</strong> de <strong className="text-white">{filtered.length}</strong> corte(s) hoy
        </span>
        <div className="d-flex flex-wrap gap-2">
          <Badge bg="dark" className="badge-pill-custom fs-6">USD: <span className="text-white fw-bold">${origUSD.toFixed(2)}</span> | Final: <span className="text-gold-accent fw-bold">${finalUSD.toFixed(2)}</span></Badge>
          <Badge bg="dark" className="badge-pill-custom fs-6">Bs: <span className="text-white fw-bold">Bs. {origBS.toFixed(2)}</span> | Final: <span className="text-gold-accent fw-bold">Bs. {finalBS.toFixed(2)}</span></Badge>
        </div>
      </div>

      <ListaVentas ventas={visibles} formula={formulaActiva} />

      <ModalNuevaVenta show={showModal} onHide={() => setShowModal(false)} onSave={handleSaveVenta} />
    </MainLayout>
  );
};

export default VentasDia;
