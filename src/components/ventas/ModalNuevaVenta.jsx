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
    vendedor: usuario?.nombre || '',
    cliente: '', cedula: '', telefono: '', servicio: 'Corte Clásico', monto: '15.00',
    metodoPago: 'Efectivo', referenciaPago: '', formulaId: FORMULA_INICIAL.id
  };
  const [form, setForm] = useState(initForm);
  const [vendedores, setVendedores] = useState([]);
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!show) return;
    const actual = obtenerUsuarioActual();
    Promise.all([getVendedores(), getFormulas(), getClientes()]).then(([vends, forms, clis]) => {
      const activos = (vends || []).filter((v) => v.estado !== false);
      if (activos.length) setVendedores(activos.map((v) => ({ value: v.nombres, label: v.nombres })));
      const activas = (forms || []).filter((f) => Boolean(f.estado));
      setFormulas(activas.length ? activas : [FORMULA_INICIAL]);
      setClientes(clis || []);
      const fActiva = obtenerFormulaActiva(activas.length ? activas : [FORMULA_INICIAL]);
      setForm((p) => ({ ...p, vendedor: esAdmin ? (p.vendedor || activos?.[0]?.nombres || actual.nombre) : actual.nombre, formulaId: fActiva.id }));
    });
  }, [show]);

  const posibleDuplicado = (form.cliente.trim().length >= 3 || form.cedula.trim().length >= 4) && clientes.find((c) =>
    (form.cedula.trim() && (c.cedula || '').trim().toLowerCase() === form.cedula.trim().toLowerCase()) ||
    (c.nombres || '').toLowerCase().includes(form.cliente.trim().toLowerCase()) && (c.nombres || '').toLowerCase() !== form.cliente.trim().toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente.trim()) return;
    const formulaUsada = formulas.find((f) => f.id === form.formulaId) || FORMULA_INICIAL;
    const montoOrig = parseFloat(form.monto) || 15.0;
    await syncClienteDesdeVenta(form.cliente, form.cedula, form.telefono, form.servicio);
    onSave({
      id: `#V-${Math.floor(100 + Math.random() * 900)}`,
      fechaHora: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fechaISO: getLocalDateISO(),
      vendedor: esAdmin ? form.vendedor : usuario.nombre,
      cliente: form.cliente.trim(),
      cedulaCliente: form.cedula.trim(),
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
    <Modal show={show} onHide={onHide} size="lg" dialogClassName="modal-lg modal-venta-amplio" centered enforceFocus={false} contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5"><i className="bi bi-cash-coin text-gold-accent me-2"></i>Registrar Venta de Corte</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-3 p-md-4">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <FormSelectField id="mv-vendedor" label="Barbero" value={esAdmin ? form.vendedor : usuario.nombre} onChange={(e) => setForm({ ...form, vendedor: e.target.value })} options={vendedores} icon="bi-scissors" disabled={!esAdmin} required />
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-cliente" label="Nombre y Apellido del Cliente" value={form.cliente} list="lista-clientes-sugeridos" onChange={(e) => {
                const val = e.target.value;
                const match = clientes.find((c) => (c.nombres || '').toLowerCase() === val.trim().toLowerCase());
                setForm((p) => ({ ...p, cliente: val, cedula: match?.cedula || p.cedula, telefono: match?.telefono || p.telefono }));
              }} placeholder="Ej: Carlos Mendoza" icon="bi-person" required />
              <datalist id="lista-clientes-sugeridos">{clientes.map((c) => <option key={c.id} value={c.nombres}>{c.cedula ? `C.I: ${c.cedula} • ` : ''}{c.telefono ? `Telf: ${c.telefono}` : ''}</option>)}</datalist>
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-cedula" label="Cédula de Identidad" value={form.cedula} onChange={(e) => {
                const cVal = e.target.value;
                const match = clientes.find((c) => (c.cedula || '').trim().toLowerCase() === cVal.trim().toLowerCase());
                setForm((p) => ({ ...p, cedula: cVal, cliente: match?.nombres || p.cliente, telefono: match?.telefono || p.telefono }));
              }} placeholder="Ej: V-28123456" icon="bi-card-text" />
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-tel-cliente" label="Teléfono de Contacto" type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+58 412 0000000" icon="bi-telephone" />
            </Col>
            {posibleDuplicado && (
              <Col xs={12}>
                <div className="alert alert-warning py-2 px-3 m-0 small border-gold d-flex align-items-center justify-content-between rounded" style={{ background: '#201804', color: '#ffda73' }}>
                  <span><i className="bi bi-exclamation-triangle-fill me-2 text-gold-accent"></i>¿Cliente existente? <strong>{posibleDuplicado.nombres}</strong> {posibleDuplicado.cedula ? `(C.I: ${posibleDuplicado.cedula})` : ''} {posibleDuplicado.telefono ? `(${posibleDuplicado.telefono})` : ''}</span>
                  <button type="button" className="btn btn-sm btn-link text-gold-accent p-0 fw-bold text-decoration-none" onClick={() => setForm((p) => ({ ...p, cliente: posibleDuplicado.nombres, cedula: posibleDuplicado.cedula || p.cedula, telefono: posibleDuplicado.telefono || p.telefono }))}>Usar Datos</button>
                </div>
              </Col>
            )}
            <Col xs={12} md={6}>
              <FormSelectField id="mv-servicio" label="Servicio Realizado" value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} options={SERVICIOS} icon="bi-tag" required />
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-monto" label="Monto Original ($)" type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} placeholder="15.00" icon="bi-currency-dollar" required />
            </Col>
            <Col xs={12} md={6}>
              <FormSelectField id="mv-formula" label="Fórmula Aplicada" value={form.formulaId} onChange={(e) => setForm({ ...form, formulaId: e.target.value })} options={formulas.map((f) => ({ value: f.id, label: f.nombre }))} icon="bi-calculator" required />
            </Col>
            <Col xs={12} md={6}>
              <FormSelectField id="mv-metodo" label="Método de Pago" value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })} options={METODOS} icon="bi-credit-card" required />
            </Col>
            <Col xs={12}>
              <FormInputField id="mv-ref" label="Referencia Método de Pago" value={form.referenciaPago} onChange={(e) => setForm({ ...form, referenciaPago: e.target.value })} placeholder="Ej: Ref #849204 / Comprobante Pago Móvil / Titular Zelle / Efectivo" icon="bi-hash" />
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
