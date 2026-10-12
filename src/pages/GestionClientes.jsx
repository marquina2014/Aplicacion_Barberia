import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';
import BarraFiltrosClientes from '../components/barber/BarraFiltrosClientes';
import { getClientes, saveCliente } from '../services/api';

/**
 * Vista: GestionClientes
 * Propósito: Listado, filtros unificados, edición y activación/inactivación de clientes.
 */
const GestionClientes = () => {
  const initFilters = { nombre: '', telefono: '', estado: '' };
  const [filters, setFilters] = useState(initFilters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const initForm = { nombres: '', telefono: '', estado: true, visitas: 1, ultimo: 'Nuevo Registro' };
  const [formData, setFormData] = useState(initForm);

  useEffect(() => { getClientes().then(setClientes); }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setClientes(await getClientes());
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleOpenNew = () => { setEditingId(null); setFormData(initForm); setShowModal(true); };
  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      ...c, nombres: c.nombres || '', telefono: c.telefono || '',
      estado: typeof c.estado === 'boolean' ? c.estado : true
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nombres || !formData.telefono) return;
    const guardado = await saveCliente({ ...formData, estado: Boolean(formData.estado) }, editingId);
    setClientes((prev) =>
      editingId ? prev.map((c) => (String(c.id) === String(editingId) ? guardado : c)) : [guardado, ...prev]
    );
    setShowModal(false);
  };

  const filtered = clientes.filter((c) => {
    const activo = typeof c.estado === 'boolean' ? c.estado : true;
    if (filters.nombre && !(c.nombres || '').toLowerCase().includes(filters.nombre.toLowerCase())) return false;
    if (filters.telefono && !(c.telefono || '').includes(filters.telefono)) return false;
    if (filters.estado === 'activo' && !activo) return false;
    if (filters.estado === 'inactivo' && activo) return false;
    return true;
  });

  return (
    <MainLayout title="Gestión de Clientes" subtitle="Directorio y fidelidad de clientes">
      <BarraFiltrosClientes
        filters={filters}
        onFilterChange={(field, val) => setFilters((prev) => ({ ...prev, [field]: val }))}
        onReset={() => setFilters(initFilters)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onNuevoCliente={handleOpenNew}
      />

      <Row className="g-3">
        {filtered.map((c) => {
          const activo = typeof c.estado === 'boolean' ? c.estado : true;
          return (
            <Col xs={12} sm={6} lg={4} key={c.id}>
              <Card className="dark-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold text-white m-0">{c.nombres}</h6>
                  <span className="badge-pill-custom">{c.visitas} visitas</span>
                </div>
                <div className="small text-secondary-custom mb-3">
                  <div><i className="bi bi-telephone text-gold-accent me-2"></i>{c.telefono}</div>
                  <div><i className="bi bi-scissors text-gold-accent me-2"></i>Último: <span className="text-white">{c.ultimo}</span></div>
                  <div>
                    <i className="bi bi-shield-check text-gold-accent me-2"></i>Estado:{' '}
                    <span className={activo ? 'text-gold-accent fw-semibold' : 'text-danger fw-semibold'}>
                      {activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="border-top border-subtle pt-2 mt-auto d-flex justify-content-end">
                  <Button variant="outline-gold" size="sm" className="px-3" onClick={() => handleOpenEdit(c)}>
                    <i className="bi bi-pencil-square me-1"></i> Editar
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-person-plus text-gold-accent me-2"></i>
            {editingId ? 'Editar Cliente' : 'Registrar Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <FormInputField
              id="c-name" label="Nombre Completo" value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              placeholder="Ej: Fernando Ruiz" icon="bi-person" required
            />
            <FormInputField
              id="c-phone" label="Teléfono de Contacto" type="tel" value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+58 412 0000000" icon="bi-telephone" required
            />
            {editingId && (
              <div className="d-flex justify-content-between align-items-center p-2 px-3 mt-2 rounded border border-gold" style={{ background: '#0c0d0e' }}>
                <span className="small fw-semibold text-white">
                  <i className={`bi ${formData.estado ? 'bi-check-circle-fill text-gold-accent' : 'bi-slash-circle text-danger'} me-2`}></i>
                  Estado del cliente: <span className={formData.estado ? 'text-gold-accent' : 'text-danger'}>{formData.estado ? 'Activo' : 'Inactivo'}</span>
                </span>
                <Form.Check
                  type="switch" id="c-estado-switch" className="dark-check m-0 fs-5"
                  checked={Boolean(formData.estado)}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">
              {editingId ? 'Guardar Cambios' : 'Guardar Cliente'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default GestionClientes;
