import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { getLocalDateISO } from '../../utils/dateUtils';
import { getVendedores, getFormulas, getClientes, syncClienteDesdeVenta } from '../../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../../utils/sesionUsuario';
import { FORMULA_INICIAL, obtenerFormulaActiva, calcularMontoFinal } from '../../utils/formulasUtils';

const SERVICIOS = [
  { value: 'Corte Clásico', label: 'Corte Clásico ($15)' },
  { value: 'Perfilado de Barba', label: 'Perfilado de Barba ($10)' },
  { value: 'Combo Legendario', label: 'Combo Legendario ($22)' },
  { value: 'Tratamiento Capilar', label: 'Tratamiento Capilar ($18)' }
];
const METODOS = [
  { value: 'Efectivo', label: 'Efectivo (USD / Bs)' },
  { value: 'Pago Móvil', label: 'Pago Móvil' },
  { value: 'Tarjeta', label: 'Punto de Venta / Tarjeta' },
  { value: 'Zelle', label: 'Zelle' }
];

const ModalNuevaVenta = ({ show, onHide, onSave }) => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);
  const initForm = {
    vendedor: esAdmin ? 'luis marquina' : usuario.nombre,
    cliente: '', telefono: '', servicio: 'Corte Clásico', monto: '15.00',
    metodoPago: 'Efectivo', referenciaPago: '', formulaId: FORMULA_INICIAL.id
  };
  const [form, setForm] = useState(initForm);
  const [vendedores, setVendedores] = useState([{ value: 'luis marquina', label: 'luis marquina' }]);
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!show) return;
    const actual = obtenerUsuarioActual();
    Promise.all([getVendedores(), getFormulas(), getClientes()]).then(([vends, forms, clis]) => {
      if (vends?.length) setVendedores(vends.filter((v) => v.estado !== false).map((v) => ({ value: v.nombres, label: v.nombres })));
      const activas = (forms || []).filter((f) => Boolean(f.estado));
      setFormulas(activas.length ? activas : [FORMULA_INICIAL]);
      setClientes(clis || []);
      const fActiva = obtenerFormulaActiva(activas.length ? activas : [FORMULA_INICIAL]);
      setForm((p) => ({ ...p, vendedor: esAdmin ? (p.vendedor || vends?.[0]?.nombres || 'luis marquina') : actual.nombre, formulaId: fActiva.id }));
    });
  }, [show]);

  const posibleDuplicado = form.cliente.trim().length >= 3 && clientes.find((c) =>
    (c.nombres || '').toLowerCase().includes(form.cliente.trim().toLowerCase()) &&
    (c.nombres || '').toLowerCase() !== form.cliente.trim().toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente.trim()) return;
    const formulaUsada = formulas.find((f) => f.id === form.formulaId) || FORMULA_INICIAL;
    const montoOrig = parseFloat(form.monto) || 15.0;
    await syncClienteDesdeVenta(form.cliente, form.telefono, form.servicio);
    onSave({
      id: `#V-${Math.floor(100 + Math.random() * 900)}`,
      fechaHora: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fechaISO: getLocalDateISO(),
      vendedor: esAdmin ? form.vendedor : usuario.nombre,
      cliente: form.cliente.trim(),
      servicio: form.servicio,
      formulaAplicada: formulaUsada.nombre,
      monto: montoOrig,
      montoFinal: calcularMontoFinal(montoOrig, formulaUsada),
      pago: form.metodoPago,
      referenciaPago: form.referenciaPago.trim()
    });
    setForm(initForm);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered enforceFocus={false} contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5"><i className="bi bi-cash-coin text-gold-accent me-2"></i>Registrar Venta de Corte</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-3 p-sm-4">
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-vendedor" label="Barbero" value={esAdmin ? form.vendedor : usuario.nombre} onChange={(e) => setForm({ ...form, vendedor: e.target.value })} options={vendedores} icon="bi-scissors" disabled={!esAdmin} required />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField id="mv-cliente" label="Nombre del Cliente" value={form.cliente} list="lista-clientes-sugeridos" onChange={(e) => {
                const val = e.target.value;
                const match = clientes.find((c) => (c.nombres || '').toLowerCase() === val.trim().toLowerCase());
                setForm((p) => ({ ...p, cliente: val, telefono: match?.telefono || p.telefono }));
              }} placeholder="Ej: Carlos Mendoza" icon="bi-person" required />
              <datalist id="lista-clientes-sugeridos">{clientes.map((c) => <option key={c.id} value={c.nombres}>{c.telefono ? `(${c.telefono})` : ''}</option>)}</datalist>
            </Col>
          </Row>
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormInputField id="mv-tel-cliente" label="Teléfono del Cliente" type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+58 412 0000000" icon="bi-telephone" />
            </Col>
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-servicio" label="Servicio Realizado" value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} options={SERVICIOS} icon="bi-tag" required />
            </Col>
          </Row>
          {posibleDuplicado && (
            <div className="alert alert-warning py-1 px-2 mt-1 mb-2 small border-gold d-flex align-items-center justify-content-between" style={{ background: '#201804', color: '#ffda73' }}>
              <span><i className="bi bi-exclamation-triangle-fill me-1 text-gold-accent"></i>¿Cliente existente? <strong>{posibleDuplicado.nombres}</strong> ({posibleDuplicado.telefono || 'Sin telf.'})</span>
              <button type="button" className="btn btn-sm btn-link text-gold-accent p-0 fw-bold" onClick={() => setForm((p) => ({ ...p, cliente: posibleDuplicado.nombres, telefono: posibleDuplicado.telefono || p.telefono }))}>Usar</button>
            </div>
          )}
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormInputField id="mv-monto" label="Monto Original ($)" type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} placeholder="15.00" icon="bi-currency-dollar" required />
            </Col>
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-formula" label="Fórmula Aplicada" value={form.formulaId} onChange={(e) => setForm({ ...form, formulaId: e.target.value })} options={formulas.map((f) => ({ value: f.id, label: f.nombre }))} icon="bi-calculator" required />
            </Col>
          </Row>
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField id="mv-metodo" label="Método de Pago" value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })} options={METODOS} icon="bi-credit-card" required />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField id="mv-ref" label="Referencia Método de Pago" value={form.referenciaPago} onChange={(e) => setForm({ ...form, referenciaPago: e.target.value })} placeholder="Ej: Ref 849204 / Zelle / Efectivo" icon="bi-hash" />
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
