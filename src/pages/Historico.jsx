import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosVentas from '../components/ventas/BarraFiltrosVentas';
import ListaVentas from '../components/ventas/ListaVentas';
import ModalNuevaVenta from '../components/ventas/ModalNuevaVenta';
import { getVentas, createVenta, getVendedores, getFormulas } from '../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../utils/sesionUsuario';
import { exportarVentasExcel } from '../utils/exportarExcel';
import { FORMULA_INICIAL, obtenerFormulaActiva, calcularMontoFinal } from '../utils/formulasUtils';

/**
 * Vista: Historico (Auditoría Completa de Ventas)
 * Propósito: Registro histórico conectado a JSON Server con Monto Original y Monto Final.
 */
const Historico = () => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);
  const vendedorInicial = esAdmin ? '' : usuario.nombre;

  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initFilters = {
    vendedor: vendedorInicial,
    cliente: '',
    fechaDesde: '',
    fechaHasta: '',
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
    if (filters.vendedor && (v.vendedor || '').toLowerCase() !== filters.vendedor.toLowerCase()) return false;
    if (filters.cliente && !(v.cliente || '').toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.fechaDesde && v.fechaISO < filters.fechaDesde) return false;
    if (filters.fechaHasta && v.fechaISO > filters.fechaHasta) return false;
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
    exportarVentasExcel(todas.filter(cumpleFiltro), 'Historico_Ventas_Legendario', formulaActiva);
  };

  return (
    <MainLayout title="Histórico de Ventas" subtitle="Auditoría cronológica con filtros avanzados">
      <BarraFiltrosVentas
        modo="historico"
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh}
        isRefreshing={isRefreshing} onNuevaVenta={() => setShowModal(true)}
        onExportExcel={handleExportar}
        vendedores={vendedores.length ? vendedores : undefined}
        vendedorDisabled={!esAdmin}
      />

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

export default Historico;
