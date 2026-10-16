import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import ModalFormula from '../formulas/ModalFormula';
import { getFormulas, saveFormula } from '../../services/dimensionesApi';
import { FORMULA_INICIAL } from '../../utils/formulasUtils';

const formatearFecha = (iso) => {
  if (!iso) return '12/10/2026';
  const [y, m, d] = String(iso).split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
};

const TabFormulas = () => {
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [showModal, setShowModal] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);

  const cargarFormulas = async () => {
    const data = await getFormulas();
    setFormulas(data?.length ? data : [FORMULA_INICIAL]);
  };

  useEffect(() => { cargarFormulas(); }, []);

  const handleSaveFormula = async (data, editId) => {
    const actualizadas = await saveFormula(data, editId);
    setFormulas(actualizadas);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <span className="small text-secondary-custom">
          Fórmulas registradas: <strong className="text-white">{formulas.length}</strong> | Activas: <strong className="text-gold-accent">{formulas.filter((f) => Boolean(f.estado)).length}</strong>
        </span>
        <Button className="btn-primary-gradient d-flex align-items-center gap-2" onClick={() => { setEditingFormula(null); setShowModal(true); }}>
          <i className="bi bi-plus-circle-fill"></i><span>Nueva Fórmula</span>
        </Button>
      </div>

      <div className="table-container-card p-3">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Nombre de la Fórmula</th><th>Regla / Expresión</th><th>Pasos</th><th>Fecha</th><th>Principal</th><th>Estado</th><th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map((f) => (
              <tr key={f.id}>
                <td className="fw-bold text-gold-accent">{f.id}</td>
                <td className="fw-semibold text-white"><i className="bi bi-calculator text-gold-accent me-2"></i>{f.nombre}</td>
                <td className="text-secondary-custom">{f.descripcion}</td>
                <td><span className="service-pill">{f.pasos || 2} Pasos</span></td>
                <td><i className="bi bi-calendar3 text-gold-accent me-2"></i>{formatearFecha(f.fechaCreacion)}</td>
                <td>{f.principal ? <span className="badge-pill-custom">Principal</span> : <span className="text-muted-custom small">-</span>}</td>
                <td><Badge bg={Boolean(f.estado) ? 'success' : 'secondary'}>{Boolean(f.estado) ? 'Activo' : 'Inactivo'}</Badge></td>
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

      <ModalFormula show={showModal} onHide={() => setShowModal(false)} onSave={handleSaveFormula} editingFormula={editingFormula} />
    </div>
  );
};

export default TabFormulas;
