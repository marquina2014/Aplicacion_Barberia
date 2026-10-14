import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { TIPOS_FORMULA } from '../../utils/formulasUtils';

const INIT_FORM = {
  nombre: '',
  descripcion: '',
  tipo: '',
  porcentajeCorte: '',
  porcentajeReduccion: '',
  pasos: '',
  principal: true,
  estado: true
};

/**
 * Componente: ModalFormula
 * Propósito: Modal para crear o editar fórmulas con todos los campos vacíos por defecto al crear.
 */
const ModalFormula = ({ show, onHide, onSave, editingFormula = null }) => {
  const [form, setForm] = useState(INIT_FORM);

  useEffect(() => {
    if (editingFormula) {
      setForm({
        nombre: editingFormula.nombre || '',
        descripcion: editingFormula.descripcion || '',
        tipo: editingFormula.tipo || '',
        porcentajeCorte: String(editingFormula.porcentajeCorte ?? ''),
        porcentajeReduccion: String(editingFormula.porcentajeReduccion ?? ''),
        pasos: String(editingFormula.pasos ?? ''),
        principal: Boolean(editingFormula.principal),
        estado: Boolean(editingFormula.estado)
      });
    } else {
      setForm(INIT_FORM);
    }
  }, [editingFormula, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const descAuto =
      form.descripcion.trim() ||
      `${form.porcentajeCorte}% del corte, menos ${Number(form.porcentajeReduccion) === 50 ? 'la mitad' : `${form.porcentajeReduccion}%`}`;
    onSave(
      {
        ...form,
        tipo: form.tipo || 'descuento_y_mitad',
        descripcion: descAuto,
        pasos: Number(form.pasos || 1),
        principal: form.estado ? form.principal : false
      },
      editingFormula?.id || null
    );
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered enforceFocus={false} contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5">
          <i className="bi bi-calculator-fill text-gold-accent me-2"></i>
          {editingFormula ? 'Editar Fórmula' : 'Nueva Fórmula'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-2">
            <Col xs={12} sm={8}>
              <FormInputField
                id="mf-nombre" label="Nombre de la Fórmula" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="" icon="bi-bookmark-star" required
              />
            </Col>
            <Col xs={12} sm={4}>
              <FormInputField
                id="mf-pasos" label="N° de Pasos" type="number" value={form.pasos}
                onChange={(e) => setForm({ ...form, pasos: e.target.value })}
                placeholder="" icon="bi-diagram-3" required
              />
            </Col>
          </Row>

          <FormSelectField
            id="mf-tipo" label="Regla de Cálculo" value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={TIPOS_FORMULA} placeholder="" icon="bi-sliders" required
          />

          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormInputField
                id="mf-pcorte" label="Porcentaje del Corte (%)" type="number" value={form.porcentajeCorte}
                onChange={(e) => setForm({ ...form, porcentajeCorte: e.target.value })}
                placeholder="" icon="bi-percent" required
              />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField
                id="mf-pred" label="Reducción / Mitad (%)" type="number" value={form.porcentajeReduccion}
                onChange={(e) => setForm({ ...form, porcentajeReduccion: e.target.value })}
                placeholder="" icon="bi-scissors" required
              />
            </Col>
          </Row>

          <FormInputField
            id="mf-desc" label="Descripción de los Pasos" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="" icon="bi-card-text"
          />

          <div className="p-3 rounded border border-gold">
            <Form.Check
              type="switch" id="mf-estado" className="fw-semibold text-white small"
              label={form.estado ? 'Estado: Activo' : 'Estado: Inactivo'}
              checked={Boolean(form.estado)}
              onChange={(e) => setForm({ ...form, estado: Boolean(e.target.checked) })}
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
