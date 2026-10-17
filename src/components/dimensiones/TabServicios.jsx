import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import { getServicios, saveServicio } from '../../services/dimensionesApi';

const TabServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const initForm = { nombre: '', precio: 15, estado: true };
  const [form, setForm] = useState(initForm);

  const cargar = async () => setServicios(await getServicios());
  useEffect(() => { cargar(); }, []);

  const handleOpenNew = () => { setEditingId(null); setForm(initForm); setShowModal(true); };
  const handleOpenEdit = (s) => {
    setEditingId(s.id);
    setForm({ nombre: s.nombre || '', precio: s.precio ?? 15, estado: s.estado !== false });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const actualizados = await saveServicio(form, editingId);
    setServicios(actualizados);
    setShowModal(false);
  };

  const filtrados = servicios.filter((s) => {
    if (filtroNombre && s.nombre !== filtroNombre) return false;
    if (filtroPrecio !== '' && Number(s.precio || 0) !== Number(filtroPrecio)) return false;
    return true;
  });

  const preciosUnicos = [...new Set(servicios.map((s) => Number(s.precio || 0)))].sort((a, b) => a - b);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2" style={{ flex: '1 1 auto', maxWidth: '620px' }}>
          <div style={{ minWidth: '220px', flex: '1' }}>
            <Form.Select className="dark-input" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)}>
              <option value="">Todos los servicios ({servicios.length})</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.nombre}>{s.nombre}</option>
              ))}
            </Form.Select>
          </div>
          <div style={{ minWidth: '180px', flex: '1' }}>
            <Form.Select className="dark-input" value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)}>
              <option value="">Todos los precios base</option>
              {preciosUnicos.map((p) => (
                <option key={p} value={p}>Precio: ${Number(p).toFixed(2)}</option>
              ))}
            </Form.Select>
          </div>
        </div>
        <Button className="btn-primary-gradient d-flex align-items-center gap-2" onClick={handleOpenNew}>
          <i className="bi bi-plus-circle-fill"></i><span>Nuevo Servicio</span>
        </Button>
      </div>

      <div className="table-container-card p-3">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Nombre del Servicio</th><th>Precio Base ($)</th><th>Estado</th><th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4 text-muted-custom">No hay servicios que coincidan.</td></tr>
            ) : filtrados.map((s) => (
              <tr key={s.id}>
                <td className="fw-bold text-gold-accent">{s.id}</td>
                <td className="fw-semibold text-white"><i className="bi bi-scissors text-gold-accent me-2"></i>{s.nombre}</td>
                <td className="fw-bold text-white">${Number(s.precio || 0).toFixed(2)}</td>
                <td><Badge bg={s.estado !== false ? 'success' : 'secondary'}>{s.estado !== false ? 'Activo' : 'Inactivo'}</Badge></td>
                <td className="text-end">
                  <Button variant="outline-gold" size="sm" onClick={() => handleOpenEdit(s)}>
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
            <i className="bi bi-tag-fill text-gold-accent me-2"></i>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <FormInputField id="srv-name" label="Nombre del Servicio" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Corte Degradado" icon="bi-scissors" required />
            <FormInputField id="srv-precio" label="Precio Base ($ USD)" type="number" step="0.5" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="15.00" icon="bi-currency-dollar" required />
            <div className="d-flex justify-content-between align-items-center p-2 px-3 mt-3 rounded border border-gold" style={{ background: '#0c0d0e' }}>
              <span className="small fw-semibold text-white">Estado: <span className={form.estado ? 'text-gold-accent' : 'text-danger'}>{form.estado ? 'Activo' : 'Inactivo'}</span></span>
              <Form.Check type="switch" id="srv-estado-sw" className="dark-check m-0 fs-5" checked={Boolean(form.estado)} onChange={(e) => setForm({ ...form, estado: e.target.checked })} />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">{editingId ? 'Guardar Cambios' : 'Crear Servicio'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TabServicios;
