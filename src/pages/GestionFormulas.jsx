import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosFormulas from '../components/formulas/BarraFiltrosFormulas';
import ModalFormula from '../components/formulas/ModalFormula';
import ListaVentas from '../components/ventas/ListaVentas';
import { getVentas, getVendedores, getFormulas, saveFormula } from '../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../utils/sesionUsuario';
import { exportarVentasExcel } from '../utils/exportarExcel';
import { getLocalDateISO } from '../utils/dateUtils';
import { FORMULA_INICIAL, obtenerFormulaActiva, calcularMontoFinal } from '../utils/formulasUtils';

/**
 * Vista: GestionFormulas
 * Propósito: Pantalla de Fórmulas con la estructura de Ventas del Día.
 * Permite crear/seleccionar fórmulas que dictan el Monto Final del corte para el barbero.
 */
const GestionFormulas = () => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);
  const vendedorInicial = esAdmin ? '' : usuario.nombre;
  const hoyISO = getLocalDateISO();

  const [showModalFormula, setShowModalFormula] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initFilters = { vendedor: vendedorInicial, cliente: '', servicio: '', pago: '' };
  const [filters, setFilters] = useState(initFilters);
  const [ventas, setVentas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [formulaActiva, setFormulaActiva] = useState(FORMULA_INICIAL);

  const cargarDatos = async () => {
    const [listaVentas, listaVendedores, listaFormulas] = await Promise.all([
      getVentas(), getVendedores(), getFormulas()
    ]);
    setVentas(listaVentas);
    setVendedores(listaVendedores.map((v) => v.nombres));
    const fList = listaFormulas?.length ? listaFormulas : [FORMULA_INICIAL];
    setFormulas(fList);
    setFormulaActiva(obtenerFormulaActiva(fList));
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleFilterChange = (field, val) => {
    if (field === 'vendedor' && !esAdmin) return;
    setFilters((prev) => ({ ...prev, [field]: val }));
  };
  const handleReset = () => setFilters({ ...initFilters, vendedor: esAdmin ? '' : usuario.nombre });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await cargarDatos();
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleSaveFormula = async (data, editId) => {
    const actualizadas = await saveFormula(data, editId);
    setFormulas(actualizadas);
    setFormulaActiva(obtenerFormulaActiva(actualizadas));
  };

  const handleSelectFormula = async (f) => {
    setFormulaActiva(f);
    const actualizadas = await saveFormula({ ...f, principal: true }, f.id);
    setFormulas(actualizadas);
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
  const totalOriginal = filtered.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  const totalFinal = filtered.reduce((acc, curr) => acc + calcularMontoFinal(curr.monto, formulaActiva), 0);
  const visibles = filtered.slice(0, 30);

  return (
    <MainLayout title="Fórmulas de Corte" subtitle="Cálculo de comisiones: Monto Original vs Monto Final del Barbero">
      <BarraFiltrosFormulas
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh} isRefreshing={isRefreshing}
        onNuevaFormula={() => { setEditingFormula(null); setShowModalFormula(true); }}
        onExportExcel={() => exportarVentasExcel(filtered, 'Formulas_Ventas_Legendario', formulaActiva)}
        formulas={formulas} formulaActivaId={formulaActiva.id} onSelectFormula={handleSelectFormula}
        vendedores={vendedores.length ? vendedores : undefined} vendedorDisabled={!esAdmin}
      />

      <Row className="g-3 mb-3">
        <Col xs={6} lg={3}><div className="metric-card p-3"><small className="text-secondary-custom d-block mb-1">Monto Original (Hoy)</small><h3 className="fw-bold text-white m-0">${totalOriginal.toFixed(2)}</h3></div></Col>
        <Col xs={6} lg={3}><div className="metric-card p-3"><small className="text-secondary-custom d-block mb-1">Monto Final (Barbero)</small><h3 className="fw-bold text-gold-accent m-0">${totalFinal.toFixed(2)}</h3></div></Col>
        <Col xs={6} lg={3}>
          <div className="metric-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-secondary-custom">Fórmula Activa</small>
              <Button variant="link" className="p-0 text-gold-accent small text-decoration-none" onClick={() => { setEditingFormula(formulaActiva); setShowModalFormula(true); }}>
                <i className="bi bi-pencil-square"></i> Editar
              </Button>
            </div>
            <h4 className="fw-bold text-white m-0 fs-6 text-truncate" title={formulaActiva.descripcion}>{formulaActiva.descripcion}</h4>
          </div>
        </Col>
        <Col xs={6} lg={3}><div className="metric-card p-3"><small className="text-secondary-custom d-block mb-1">Servicios Calculados</small><h3 className="fw-bold text-white m-0">{filtered.length} Cortes</h3></div></Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span className="small text-secondary-custom">
          Mostrando <strong className="text-white">{visibles.length}</strong> de <strong className="text-white">{filtered.length}</strong> registro(s)
        </span>
        <div className="d-flex gap-2">
          <Badge bg="dark" className="badge-pill-custom fs-6">Original: <span className="text-white fw-bold">${totalOriginal.toFixed(2)}</span></Badge>
          <Badge bg="dark" className="badge-pill-custom fs-6">Final Barbero: <span className="text-white fw-bold">${totalFinal.toFixed(2)}</span></Badge>
        </div>
      </div>

      <ListaVentas ventas={visibles} formula={formulaActiva} />

      <ModalFormula show={showModalFormula} onHide={() => setShowModalFormula(false)} onSave={handleSaveFormula} editingFormula={editingFormula} />
    </MainLayout>
  );
};

export default GestionFormulas;
