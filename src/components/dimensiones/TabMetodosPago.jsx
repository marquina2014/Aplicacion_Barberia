import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { getMetodosPago, saveMetodoPago } from '../../services/dimensionesApi';

const MONEDAS = [{ value: 'Dólares', label: 'Dólares ($)' }, { value: 'Bolívares', label: 'Bolívares (Bs)' }];

const TabMetodosPago = () => {
  const [metodos, setMetodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroMoneda, setFiltroMoneda] = useState('');
  const initForm = { nombre: '', moneda: 'Dólares', estado: true };
  const [form, setForm] = useState(initForm);

  const cargar = async () => setMetodos(await getMetodosPago());
  useEffect(() => { cargar(); }, []);

  const handleOpenNew = () => { setEditingId(null); setForm(initForm); setShowModal(true); };
  const handleOpenEdit = (m) => {
    setEditingId(m.id);
    setForm({ nombre: m.nombre || '', moneda: m.moneda || 'Dólares', estado: m.estado !== false });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const actualizados = await saveMetodoPago(form, editingId);
    setMetodos(actualizados);
    setShowModal(false);
  };

  const filtrados = metodos.filter((m) => {
    if (filtroNombre && m.nombre !== filtroNombre) return false;
    if (filtroMoneda && m.moneda !== filtroMoneda) return false;
    return true;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2" style={{ flex: '1 1 auto', maxWidth: '620px' }}>
          <div style={{ minWidth: '220px', flex: '1' }}>
            <Form.Select className="dark-input" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)}>
              <option value="">Todos los métodos ({metodos.length})</option>
              {metodos.map((m) => (
                <option key={m.id} value={m.nombre}>{m.nombre}</option>
              ))}
            </Form.Select>
          </div>
          <div style={{ minWidth: '180px', flex: '1' }}>
            <Form.Select className="dark-input" value={filtroMoneda} onChange={(e) => setFiltroMoneda(e.target.value)}>
              <option value="">Todas las monedas</option>
              <option value="Dólares">Dólares ($)</option>
              <option value="Bolívares">Bolívares (Bs)</option>
            </Form.Select>
          </div>
        </div>
        <Button className="btn-primary-gradient d-flex align-items-center gap-2" onClick={handleOpenNew}>
          <i className="bi bi-plus-circle-fill"></i><span>Nuevo Método de Pago</span>
        </Button>
      </div>

      <div className="table-container-card p-3">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Método de Pago</th><th>Moneda Asociada</th><th>Estado</th><th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4 text-muted-custom">No hay métodos de pago que coincidan.</td></tr>
            ) : filtrados.map((m) => (
              <tr key={m.id}>
                <td className="fw-bold text-gold-accent">{m.id}</td>
                <td className="fw-semibold text-white"><i className="bi bi-credit-card text-gold-accent me-2"></i>{m.nombre}</td>
                <td><span className="badge-pill-custom">{m.moneda || 'Dólares'}</span></td>
                <td><Badge bg={m.estado !== false ? 'success' : 'secondary'}>{m.estado !== false ? 'Activo' : 'Inactivo'}</Badge></td>
                <td className="text-end">
                  <Button variant="outline-gold" size="sm" onClick={() => handleOpenEdit(m)}>
                    <i className="bi bi-pencil-square me-1"></i>Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-wallet2 text-gold-accent me-2"></i>{editingId ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <FormInputField id="mp-name" label="Nombre del Método" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Pago Móvil / Zelle" icon="bi-credit-card" required />
            <FormSelectField id="mp-moneda" label="Moneda" value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })} options={MONEDAS} icon="bi-coin" required />
            <div className="d-flex justify-content-between align-items-center p-2 px-3 mt-3 rounded border border-gold" style={{ background: '#0c0d0e' }}>
              <span className="small fw-semibold text-white">Estado: <span className={form.estado ? 'text-gold-accent' : 'text-danger'}>{form.estado ? 'Activo' : 'Inactivo'}</span></span>
              <Form.Check type="switch" id="mp-estado-sw" className="dark-check m-0 fs-5" checked={Boolean(form.estado)} onChange={(e) => setForm({ ...form, estado: e.target.checked })} />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">{editingId ? 'Guardar Cambios' : 'Crear Método'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TabMetodosPago;
