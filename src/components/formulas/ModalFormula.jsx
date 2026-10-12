import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { TIPOS_FORMULA, calcularMontoFinal } from '../../utils/formulasUtils';

const INIT_FORM = {
  nombre: '',
  descripcion: '',
  tipo: 'descuento_y_mitad',
  porcentajeCorte: '18',
  porcentajeReduccion: '50',
  principal: true,
  estado: true
};

/**
 * Componente: ModalFormula
 * Propósito: Modal para crear o editar fórmulas que dictan el monto final del corte para el barbero.
 */
const ModalFormula = ({ show, onHide, onSave, editingFormula = null }) => {
  const [form, setForm] = useState(INIT_FORM);

  useEffect(() => {
    if (editingFormula) {
      setForm({
        nombre: editingFormula.nombre || '',
        descripcion: editingFormula.descripcion || '',
        tipo: editingFormula.tipo || 'descuento_y_mitad',
        porcentajeCorte: String(editingFormula.porcentajeCorte ?? 18),
        porcentajeReduccion: String(editingFormula.porcentajeReduccion ?? 50),
        principal: Boolean(editingFormula.principal),
        estado: editingFormula.estado !== false
      });
    } else {
      setForm(INIT_FORM);
    }
  }, [editingFormula, show]);

  const ejemploOriginal = 20;
  const ejemploFinal = calcularMontoFinal(ejemploOriginal, form);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const descAuto =
      form.descripcion.trim() ||
      `${form.porcentajeCorte}% del corte, menos ${Number(form.porcentajeReduccion) === 50 ? 'la mitad' : `${form.porcentajeReduccion}%`}`;
    onSave({ ...form, descripcion: descAuto }, editingFormula?.id || null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered enforceFocus={false} contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5">
          <i className="bi bi-calculator-fill text-gold-accent me-2"></i>
          {editingFormula ? 'Editar Fórmula de Corte' : 'Nueva Fórmula de Corte'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <FormInputField
            id="mf-nombre" label="Nombre de la Fórmula" value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Fórmula Estándar (18% menos la mitad)" icon="bi-bookmark-star" required
          />

          <FormSelectField
            id="mf-tipo" label="Regla de Cálculo" value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={TIPOS_FORMULA} icon="bi-sliders" required
          />

          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormInputField
                id="mf-pcorte" label="Porcentaje del Corte (%)" type="number" value={form.porcentajeCorte}
                onChange={(e) => setForm({ ...form, porcentajeCorte: e.target.value })}
                placeholder="18" icon="bi-percent" required
              />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField
                id="mf-pred" label="Reducción / Mitad (%)" type="number" value={form.porcentajeReduccion}
                onChange={(e) => setForm({ ...form, porcentajeReduccion: e.target.value })}
                placeholder="50" icon="bi-scissors" required
              />
            </Col>
          </Row>

          <FormInputField
            id="mf-desc" label="Descripción de la Fórmula" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Ej: 18% del corte, menos la mitad queda al barbero" icon="bi-card-text"
          />

          <div className="p-3 rounded border border-gold mb-3" style={{ backgroundColor: 'rgba(212, 175, 55, 0.06)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-secondary-custom">Simulación (Corte de ${ejemploOriginal.toFixed(2)}):</small>
              <span className="fw-bold text-gold-accent">
                Original: ${ejemploOriginal.toFixed(2)} → Final: ${ejemploFinal.toFixed(2)}
              </span>
            </div>
            <Form.Check
              type="switch" id="mf-principal" className="fw-semibold text-white small"
              label="Aplicar como fórmula activa predeterminada en cortes"
              checked={form.principal}
              onChange={(e) => setForm({ ...form, principal: e.target.checked })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="border-gold">
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" className="btn-primary-gradient px-4">Guardar Fórmula</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalFormula;
