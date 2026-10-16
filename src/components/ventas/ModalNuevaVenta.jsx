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

const normCed = (val) => String(val || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

const ModalNuevaVenta = ({ show, onHide, onSave }) => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);
  const initForm = {
    vendedor: usuario?.nombre || '',
    cedula: '', cliente: '', telefono: '', servicio: 'Corte Clásico', monto: '15.00',
    metodoPago: 'Efectivo', referenciaPago: '', formulaId: FORMULA_INICIAL.id
  };
  const [form, setForm] = useState(initForm);
  const [vendedores, setVendedores] = useState([]);
  const [formulas, setFormulas] = useState([FORMULA_INICIAL]);
  const [clientes, setClientes] = useState([]);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);

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
    setClienteEncontrado(null);
  }, [show]);

  const handleCedulaChange = (e) => {
    const val = e.target.value;
    const match = val.trim().length >= 4 && clientes.find((c) => normCed(c.cedula) === normCed(val));
    setClienteEncontrado(match || null);
    setForm((p) => ({
      ...p,
      cedula: val,
      cliente: match ? match.nombres : p.cliente,
      telefono: match ? (match.telefono || '') : p.telefono
    }));
  };

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
    setClienteEncontrado(null);
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
              <FormInputField id="mv-cedula" label="Cédula del Cliente (Buscar / Registrar)" value={form.cedula} list="lista-cedulas-registradas" onChange={handleCedulaChange} placeholder="Ej: V-28123456" icon="bi-card-text" />
              <datalist id="lista-cedulas-registradas">{clientes.filter((c) => c.cedula).map((c) => <option key={c.id} value={c.cedula}>{c.nombres}</option>)}</datalist>
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-cliente" label="Nombre y Apellido del Cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Ej: Carlos Mendoza" icon="bi-person" required />
            </Col>
            <Col xs={12} md={6}>
              <FormInputField id="mv-tel-cliente" label="Teléfono de Contacto" type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+58 412 0000000" icon="bi-telephone" />
            </Col>
            {clienteEncontrado && (
              <Col xs={12}>
                <div className="alert alert-success py-2 px-3 m-0 small border-gold d-flex align-items-center justify-content-between rounded" style={{ background: '#0f2415', color: '#75e69e', borderColor: '#2b8a3e' }}>
                  <span><i className="bi bi-check-circle-fill me-2"></i>Cliente encontrado: <strong>{clienteEncontrado.nombres}</strong> ({clienteEncontrado.visitas || 1} visitas registradas)</span>
                  <span className="badge-pill-custom">Datos cargados</span>
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
