import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';
import BarraFiltrosClientes from '../components/barber/BarraFiltrosClientes';
import { getClientes, saveCliente } from '../services/api';

/**
 * Vista: GestionClientes
 * Propósito: Listado, filtros unificados, edición y activación/inactivación de clientes (incluye Cédula).
 */
const GestionClientes = () => {
  const initFilters = { nombre: '', telefono: '', estado: 'activo' };
  const [filters, setFilters] = useState(initFilters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const initForm = { nombres: '', cedula: '', telefono: '', estado: true, visitas: 1, ultimo: 'Nuevo Registro' };
  const [formData, setFormData] = useState(initForm);

  useEffect(() => { getClientes().then(setClientes); }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setClientes(await getClientes());
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({ ...c, nombres: c.nombres || '', cedula: c.cedula || '', telefono: c.telefono || '', estado: typeof c.estado === 'boolean' ? c.estado : true });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nombres || !formData.telefono) return;
    const guardado = await saveCliente({ ...formData, estado: Boolean(formData.estado) }, editingId);
    setClientes((prev) => prev.map((c) => (String(c.id) === String(editingId) ? guardado : c)));
    setShowModal(false);
  };

  const filtered = clientes.filter((c) => {
    const activo = typeof c.estado === 'boolean' ? c.estado : true;
    if (filters.nombre && !(c.nombres || '').toLowerCase().includes(filters.nombre.toLowerCase()) && !(c.cedula || '').toLowerCase().includes(filters.nombre.toLowerCase())) return false;
    if (filters.telefono && !(c.telefono || '').includes(filters.telefono)) return false;
    if (filters.estado === 'inactivo' ? activo : !activo) return false;
    return true;
  });

  return (
    <MainLayout title="Gestión de Clientes" subtitle="Directorio de clientes registrados automáticamente desde los cortes">
      <BarraFiltrosClientes
        filters={filters} onFilterChange={(field, val) => setFilters((prev) => ({ ...prev, [field]: val }))}
        onReset={() => setFilters(initFilters)} onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {filtered.length === 0 ? (
        <div className="table-container-card p-4 text-center text-muted-custom">
          <i className="bi bi-people fs-3 d-block mb-2"></i>
          No hay clientes registrados o que coincidan con los filtros.
        </div>
      ) : (
        <Row className="g-2">
          {filtered.map((c) => {
            const activo = typeof c.estado === 'boolean' ? c.estado : true;
            return (
              <Col xs={12} key={c.id}>
                <Card className="dark-card p-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <div className="rounded-circle d-flex align-items-center justify-content-center border border-gold" style={{ width: '42px', height: '42px', minWidth: '42px', background: '#0e1012' }}>
                        <i className="bi bi-person-fill text-gold-accent fs-4"></i>
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <h6 className="fw-bold text-white m-0 fs-6">{c.nombres}</h6>
                          {c.cedula && <span className="service-pill font-monospace" style={{ fontSize: '0.75rem' }}><i className="bi bi-card-text text-gold-accent me-1"></i>{c.cedula}</span>}
                        </div>
                        <div className="small text-secondary-custom d-flex flex-wrap gap-3 mt-1">
                          {c.telefono && <span><i className="bi bi-telephone text-gold-accent me-1"></i>{c.telefono}</span>}
                          <span><i className="bi bi-scissors text-gold-accent me-1"></i>Último: <span className="text-white">{c.ultimo}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 w-100 w-md-auto pt-2 pt-md-0 border-top border-md-top-0 border-subtle">
                      <span className="badge-pill-custom">{c.visitas} {c.visitas === 1 ? 'visita' : 'visitas'}</span>
                      <span className={`small fw-semibold ${activo ? 'text-gold-accent' : 'text-danger'}`}>{activo ? 'Activo' : 'Inactivo'}</span>
                      <Button variant="outline-gold" size="sm" className="px-3" onClick={() => handleOpenEdit(c)}>
                        <i className="bi bi-pencil-square me-1"></i>Editar
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-person-gear text-gold-accent me-2"></i>Editar Cliente
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <FormInputField id="c-name" label="Nombre Completo" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} placeholder="Ej: Fernando Ruiz" icon="bi-person" required />
            <Row className="g-2">
              <Col xs={12} sm={6}>
                <FormInputField id="c-cedula" label="Cédula de Identidad" value={formData.cedula || ''} onChange={(e) => setFormData({ ...formData, cedula: e.target.value })} placeholder="Ej: V-28123456" icon="bi-card-text" />
              </Col>
              <Col xs={12} sm={6}>
                <FormInputField id="c-phone" label="Teléfono de Contacto" type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} placeholder="+58 412 0000000" icon="bi-telephone" required />
              </Col>
            </Row>
            <div className="d-flex justify-content-between align-items-center p-2 px-3 mt-2 rounded border border-gold" style={{ background: '#0c0d0e' }}>
              <span className="small fw-semibold text-white">
                <i className={`bi ${formData.estado ? 'bi-check-circle-fill text-gold-accent' : 'bi-slash-circle text-danger'} me-2`}></i>
                Estado del cliente: <span className={formData.estado ? 'text-gold-accent' : 'text-danger'}>{formData.estado ? 'Activo' : 'Inactivo'}</span>
              </span>
              <Form.Check type="switch" id="c-estado-switch" className="dark-check m-0 fs-5" checked={Boolean(formData.estado)} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">Guardar Cambios</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default GestionClientes;
