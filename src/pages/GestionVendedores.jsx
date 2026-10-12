import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';
import FormSelectField from '../components/common/FormSelectField';
import BarberPhotoUpload from '../components/barber/BarberPhotoUpload';
import BarraFiltrosVendedores from '../components/barber/BarraFiltrosVendedores';
import { getVendedores, saveVendedor } from '../services/api';

/**
 * Vista: GestionVendedores
 * Propósito: Listado, filtros avanzados y control de vendedores / barberos conectado a JSON Server.
 */
const GestionVendedores = () => {
  const initFilters = { nombre: '', usuario: '', edad: '', telefono: '', estado: '' };
  const [filters, setFilters] = useState(initFilters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const initForm = {
    nombres: '', usuario: '', password: '', email: '', rol: 'barbero', sexo: 'masculino', edad: '', telefono: '', estado: true, fotografia: ''
  };
  const [formData, setFormData] = useState(initForm);
  const genderOptions = [
    { value: 'masculino', label: 'Masculino' }, { value: 'femenino', label: 'Femenino' }, { value: 'otro', label: 'Otro' }
  ];

  useEffect(() => { getVendedores().then(setVendedores); }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setVendedores(await getVendedores());
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleOpenNew = () => { setEditingId(null); setFormData(initForm); setShowModal(true); };
  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setFormData({
      ...v, usuario: v.usuario || '', password: v.password || '',
      sexo: (v.sexo || 'masculino').toLowerCase(),
      estado: typeof v.estado === 'boolean' ? v.estado : true, fotografia: v.fotografia || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nombres || !formData.telefono) return;
    const guardado = await saveVendedor({ ...formData, estado: Boolean(formData.estado) }, editingId);
    setVendedores((prev) => editingId ? prev.map((v) => (String(v.id) === String(editingId) ? guardado : v)) : [...prev, guardado]);
    setShowModal(false);
  };

  const filtered = vendedores.filter((v) => {
    if (filters.nombre && !(v.nombres || '').toLowerCase().includes(filters.nombre.toLowerCase())) return false;
    if (filters.usuario && !(v.usuario || '').toLowerCase().includes(filters.usuario.toLowerCase())) return false;
    if (filters.edad && String(v.edad || '') !== String(filters.edad)) return false;
    if (filters.telefono && !(v.telefono || '').includes(filters.telefono)) return false;
    if (filters.estado === 'activo' && v.estado === false) return false;
    if (filters.estado === 'inactivo' && v.estado !== false) return false;
    return true;
  });

  return (
    <MainLayout title="Gestión de Vendedores" subtitle="Administración de barberos y comisionistas">
      <BarraFiltrosVendedores
        filters={filters} onFilterChange={(field, val) => setFilters((prev) => ({ ...prev, [field]: val }))}
        onReset={() => setFilters(initFilters)} onRefresh={handleRefresh}
        isRefreshing={isRefreshing} onNuevoVendedor={handleOpenNew}
      />

      <Row className="g-3">
        {filtered.map((v) => (
          <Col xs={12} sm={6} lg={4} key={v.id}>
            <Card className="dark-card p-3 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="photo-upload-box" style={{ width: '54px', height: '54px', minWidth: '54px', borderStyle: 'solid' }}>
                  {v.fotografia ? <img src={v.fotografia} alt={v.nombres} className="photo-preview-img" /> : <i className="bi bi-person-fill text-gold-accent fs-3"></i>}
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0">{v.nombres}</h6>
                  <small className="text-gold-accent">{v.rol} • {v.sexo} • {v.edad} años</small>
                </div>
              </div>
              <div className="small text-secondary-custom mb-3">
                {v.usuario && <div><i className="bi bi-person-badge text-gold-accent me-2"></i>Usuario: <span className="text-white">{v.usuario}</span></div>}
                <div><i className="bi bi-telephone text-gold-accent me-2"></i>{v.telefono}</div>
                <div>
                  <i className="bi bi-shield-check text-gold-accent me-2"></i>Estado:{' '}
                  <span className={v.estado ? 'text-gold-accent fw-semibold' : 'text-danger fw-semibold'}>{v.estado ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
              <div className="border-top border-subtle pt-2 mt-auto d-flex justify-content-end">
                <Button variant="outline-gold" size="sm" className="px-3" onClick={() => handleOpenEdit(v)}>
                  <i className="bi bi-pencil-square me-1"></i> Editar
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-person-badge text-gold-accent me-2"></i>{editingId ? 'Editar Vendedor' : 'Registrar Vendedor'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <BarberPhotoUpload photo={formData.fotografia} onPhotoChange={(img) => setFormData({ ...formData, fotografia: img })} />
            <FormInputField id="v-name" label="Nombres" value={formData.nombres} placeholder="Ej: Michael Alexander" icon="bi-person" required onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} />
            <Row className="g-2">
              <Col xs={12} sm={6}><FormInputField id="v-usuario" label="Usuario" value={formData.usuario} placeholder="Ej: michael" icon="bi-person-badge" required onChange={(e) => setFormData({ ...formData, usuario: e.target.value })} /></Col>
              <Col xs={12} sm={6}><FormInputField id="v-password" label="Contraseña" type="password" value={formData.password} placeholder="••••••••" icon="bi-lock" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></Col>
            </Row>
            <Row className="g-2">
              <Col xs={12} sm={6}><FormSelectField id="v-sexo" label="Sexo" value={formData.sexo} options={genderOptions} icon="bi-gender-ambiguous" required onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} /></Col>
              <Col xs={12} sm={6}><FormInputField id="v-edad" label="Edad" type="number" value={formData.edad} placeholder="28" icon="bi-calendar-event" required onChange={(e) => setFormData({ ...formData, edad: e.target.value })} /></Col>
            </Row>
            <FormInputField id="v-phone" label="Teléfono" type="tel" value={formData.telefono} placeholder="+58 412 0000000" icon="bi-telephone" required onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
            {editingId && (
              <div className="d-flex justify-content-between align-items-center p-2 px-3 mt-2 rounded border border-gold" style={{ background: '#0c0d0e' }}>
                <span className="small fw-semibold text-white">
                  <i className={`bi ${formData.estado ? 'bi-check-circle-fill text-gold-accent' : 'bi-slash-circle text-danger'} me-2`}></i>
                  Estado del vendedor: <span className={formData.estado ? 'text-gold-accent' : 'text-danger'}>{formData.estado ? 'Activo' : 'Inactivo'}</span>
                </span>
                <Form.Check type="switch" id="v-estado-switch" className="dark-check m-0 fs-5" checked={Boolean(formData.estado)} onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">{editingId ? 'Guardar Cambios' : 'Guardar Vendedor'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default GestionVendedores;
