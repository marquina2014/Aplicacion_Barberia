import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { getLocalDateISO } from '../../utils/dateUtils';
import { getVendedores, getFormulas } from '../../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../../utils/sesionUsuario';
import { FORMULA_INICIAL, obtenerFormulaActiva, calcularMontoFinal } from '../../utils/formulasUtils';

/**
 * Componente: ModalNuevaVenta
 * Propósito: Ventana modal emergente para registrar ventas seleccionando la Fórmula Aplicada
 * y calculando automáticamente el Monto Final del barbero.
 */
const ModalNuevaVenta = ({ show, onHide, onSave }) => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);

  const [form, setForm] = useState({
    vendedor: esAdmin ? 'luis marquina' : usuario.nombre,
    cliente: '',
    servicio: 'Corte Clásico',
    monto: '15.00',
    metodoPago: 'Efectivo',
    formulaId: FORMULA_INICIAL.id
  });

  const [vendedores, setVendedores] = useState([
    { value: 'luis marquina', label: 'luis marquina' },
    { value: 'Sofia marcano', label: 'Sofia marcano' }
  ]);
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);

  useEffect(() => {
    if (show) {
      const actual = obtenerUsuarioActual();
      const admin = esAdministrador(actual);
      Promise.all([getVendedores(), getFormulas()]).then(([listaVend, listaForm]) => {
        if (listaVend?.length) {
          setVendedores(listaVend.map((v) => ({ value: v.nombres, label: v.nombres })));
        }
        const activas = (listaForm || []).filter((f) => Boolean(f.estado));
        const fDisp = activas.length ? activas : [FORMULA_INICIAL];
        setFormulas(fDisp);
        const fActiva = obtenerFormulaActiva(fDisp);
        setForm((prev) => ({
          ...prev,
          vendedor: admin ? (prev.vendedor || listaVend?.[0]?.nombres || 'luis marquina') : actual.nombre,
          formulaId: fActiva.id
        }));
      });
    }
  }, [show]);

  const servicios = [
    { value: 'Corte Clásico', label: 'Corte Clásico ($15)' },
    { value: 'Perfilado de Barba', label: 'Perfilado de Barba ($10)' },
    { value: 'Combo Legendario', label: 'Combo Legendario ($22)' },
    { value: 'Tratamiento Capilar', label: 'Tratamiento Capilar ($18)' }
  ];

  const metodos = [
    { value: 'Efectivo', label: 'Efectivo (USD / Bs)' },
    { value: 'Pago Móvil', label: 'Pago Móvil' },
    { value: 'Tarjeta', label: 'Punto de Venta / Tarjeta' },
    { value: 'Zelle', label: 'Zelle' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente.trim()) return;

    const formulaUsada = formulas.find((f) => f.id === form.formulaId) || FORMULA_INICIAL;
    const montoOriginal = parseFloat(form.monto) || 15.0;

    onSave({
      id: `#V-${Math.floor(100 + Math.random() * 900)}`,
      fechaHora: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fechaISO: getLocalDateISO(),
      vendedor: esAdmin ? form.vendedor : usuario.nombre,
      cliente: form.cliente,
      servicio: form.servicio,
      formulaAplicada: formulaUsada.nombre,
      monto: montoOriginal,
      montoFinal: calcularMontoFinal(montoOriginal, formulaUsada),
      pago: form.metodoPago
    });

    setForm((prev) => ({ ...prev, cliente: '', servicio: 'Corte Clásico', monto: '15.00', metodoPago: 'Efectivo' }));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered enforceFocus={false} contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5">
          <i className="bi bi-cash-coin text-gold-accent me-2"></i>Registrar Nueva Venta
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-vendedor" label="Barbero" value={esAdmin ? form.vendedor : usuario.nombre} onChange={(e) => setForm({ ...form, vendedor: e.target.value })} options={vendedores} icon="bi-scissors" disabled={!esAdmin} required />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField id="mv-cliente" label="Nombre del Cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="" icon="bi-person" required />
            </Col>
          </Row>
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-servicio" label="Servicio Realizado" value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} options={servicios} icon="bi-tag" required />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField id="mv-monto" label="Monto Original ($)" type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} placeholder="" icon="bi-currency-dollar" required />
            </Col>
          </Row>
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-formula" label="Fórmula Aplicada" value={form.formulaId} onChange={(e) => setForm({ ...form, formulaId: e.target.value })} options={formulas.map((f) => ({ value: f.id, label: f.nombre }))} icon="bi-calculator" required />
            </Col>
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-metodo" label="Método de Pago" value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })} options={metodos} icon="bi-credit-card" required />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-gold">
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" className="btn-primary-gradient px-4">Guardar Venta</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalNuevaVenta;
