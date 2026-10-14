import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import BarraFiltrosFormulas from '../components/formulas/BarraFiltrosFormulas';
import ModalFormula from '../components/formulas/ModalFormula';
import { getFormulas, saveFormula } from '../services/api';
import { FORMULA_INICIAL } from '../utils/formulasUtils';

const formatearFecha = (iso) => {
  if (!iso) return '12/10/2026';
  const [y, m, d] = String(iso).split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
};

/**
 * Vista: GestionFormulas
 * Propósito: Directorio exclusivo de Fórmulas con nombre, regla, cantidad de pasos,
 * fecha de creación y estado (Activa / Inactiva).
 */
const GestionFormulas = () => {
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [showModal, setShowModal] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initFilters = { nombre: '', pasos: '', fechaCreacion: '', estado: '' };
  const [filters, setFilters] = useState(initFilters);

  const cargarFormulas = async () => {
    const data = await getFormulas();
    setFormulas(data?.length ? data : [FORMULA_INICIAL]);
  };

  useEffect(() => { cargarFormulas(); }, []);

  const handleFilterChange = (field, val) => setFilters((prev) => ({ ...prev, [field]: val }));
  const handleReset = () => setFilters(initFilters);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await cargarFormulas();
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleSaveFormula = async (data, editId) => {
    const actualizadas = await saveFormula(data, editId);
    setFormulas(actualizadas);
  };

  const filtered = formulas.filter((f) => {
    const activo = Boolean(f.estado);
    if (filters.nombre && !(f.nombre || '').toLowerCase().includes(filters.nombre.toLowerCase())) return false;
    if (filters.pasos && String(f.pasos || 2) !== String(filters.pasos).trim()) return false;
    if (filters.fechaCreacion && (f.fechaCreacion || '2026-10-12') !== filters.fechaCreacion) return false;
    if (filters.estado === 'activo' && !activo) return false;
    if (filters.estado === 'inactivo' && activo) return false;
    return true;
  });

  return (
    <MainLayout title="Fórmulas" subtitle="Configuración de fórmulas y pasos para el cálculo de cortes">
      <BarraFiltrosFormulas
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} onRefresh={handleRefresh} isRefreshing={isRefreshing}
        onNuevaFormula={() => { setEditingFormula(null); setShowModal(true); }}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-secondary-custom">
          Mostrando <strong className="text-white">{filtered.length}</strong> fórmula(s)
        </span>
        <Badge bg="dark" className="badge-pill-custom">
          Activos: <span className="text-white fw-bold">{formulas.filter((f) => Boolean(f.estado)).length}</span>
        </Badge>
      </div>

      <div className="table-container-card p-3 d-none d-md-block">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la Fórmula</th>
              <th>Regla / Expresión</th>
              <th>Pasos</th>
              <th>Fecha de Creación</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id}>
                <td className="fw-bold text-gold-accent">{f.id}</td>
                <td className="fw-semibold text-white">
                  <i className="bi bi-calculator text-gold-accent me-2"></i>{f.nombre}
                </td>
                <td className="text-secondary-custom">{f.descripcion}</td>
                <td><span className="service-pill">{f.pasos || 2} Pasos</span></td>
                <td><i className="bi bi-calendar3 text-gold-accent me-2"></i>{formatearFecha(f.fechaCreacion)}</td>
                <td>
                  <Badge bg={Boolean(f.estado) ? 'success' : 'secondary'}>
                    {Boolean(f.estado) ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="text-end">
                  <Button variant="outline-gold" size="sm" onClick={() => { setEditingFormula(f); setShowModal(true); }}>
                    <i className="bi bi-pencil-square me-1"></i>Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-md-none d-flex flex-column gap-3">
        {filtered.map((f) => (
          <div key={f.id} className="venta-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-gold-accent">{f.id}</span>
              <Badge bg={Boolean(f.estado) ? 'success' : 'secondary'}>
                {Boolean(f.estado) ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <h6 className="fw-bold text-white mb-1">
              <i className="bi bi-calculator text-gold-accent me-2"></i>{f.nombre}
            </h6>
            <small className="text-secondary-custom d-block mb-2">{f.descripcion}</small>
            <div className="d-flex justify-content-between align-items-center">
              <span className="service-pill">{f.pasos || 2} Pasos</span>
              <small className="text-secondary-custom"><i className="bi bi-calendar3 text-gold-accent me-1"></i>{formatearFecha(f.fechaCreacion)}</small>
            </div>
            <div className="venta-card-footer justify-content-end">
              <Button variant="outline-gold" size="sm" onClick={() => { setEditingFormula(f); setShowModal(true); }}>
                <i className="bi bi-pencil-square me-1"></i>Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ModalFormula show={showModal} onHide={() => setShowModal(false)} onSave={handleSaveFormula} editingFormula={editingFormula} />
    </MainLayout>
  );
};

export default GestionFormulas;
