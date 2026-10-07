import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';
import FormSelectField from '../components/common/FormSelectField';
import BarberPhotoUpload from '../components/barber/BarberPhotoUpload';

/**
 * Vista: GestionVendedores
 * Propósito: Listado, búsqueda y control de vendedores / barberos con soporte para foto.
 */
const GestionVendedores = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [vendedores, setVendedores] = useState([
    { id: '1', nombres: 'Michael Rodríguez', sexo: 'Masculino', edad: 28, telefono: '+58 412 1234567', estado: 'Activo', fotografia: null },
    { id: '2', nombres: 'Alexander Salazar', sexo: 'Masculino', edad: 24, telefono: '+58 414 9876543', estado: 'Activo', fotografia: null },
    { id: '3', nombres: 'Valeria Mendoza', sexo: 'Femenino', edad: 26, telefono: '+58 424 5556677', estado: 'En Turno', fotografia: null },
    { id: '4', nombres: 'Carlos Gómez', sexo: 'Masculino', edad: 31, telefono: '+58 416 3334455', estado: 'Inactivo', fotografia: null }
  ]);

  const [formData, setFormData] = useState({ nombres: '', sexo: 'Masculino', edad: '', telefono: '', fotografia: null });

  const genderOptions = [
    { value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'Otro', label: 'Otro' }
  ];

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ nombres: '', sexo: 'Masculino', edad: '', telefono: '', fotografia: null });
    setShowModal(true);
  };
  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setFormData({ nombres: v.nombres, sexo: v.sexo, edad: v.edad, telefono: v.telefono, fotografia: v.fotografia || null });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nombres || !formData.telefono) return;
    setVendedores((prev) => editingId ? prev.map((v) => (v.id === editingId ? { ...v, ...formData } : v)) : [...prev, { id: String(Date.now()), ...formData, estado: 'Activo' }]);
    setShowModal(false);
  };
  const filtered = vendedores.filter((v) => v.nombres.toLowerCase().includes(search.toLowerCase()));

  return (
    <MainLayout title="Gestión de Vendedores" subtitle="Administración de barberos y comisionistas">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <InputGroup style={{ maxWidth: '340px' }}>
          <InputGroup.Text className="text-gold-accent"><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control
            type="text" className="dark-input" placeholder="Buscar vendedor..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button
          className="btn-primary-gradient top-action-btn d-flex align-items-center justify-content-center gap-2"
          onClick={handleOpenNew}
        >
          <i className="bi bi-person-plus-fill"></i><span>Nuevo Vendedor</span>
        </Button>
      </div>

      <Row className="g-3">
        {filtered.map((v) => (
          <Col xs={12} sm={6} lg={4} key={v.id}>
            <Card className="dark-card p-3 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="photo-upload-box" style={{ width: '54px', height: '54px', minWidth: '54px', borderStyle: 'solid' }}>
                  {v.fotografia ? (
                    <img src={v.fotografia} alt={v.nombres} className="photo-preview-img" />
                  ) : (
                    <i className="bi bi-person-fill text-gold-accent fs-3"></i>
                  )}
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0">{v.nombres}</h6>
                  <small className="text-gold-accent">{v.sexo} • {v.edad} años</small>
                </div>
              </div>
              <div className="small text-secondary-custom mb-3">
                <div><i className="bi bi-telephone text-gold-accent me-2"></i>{v.telefono}</div>
                <div><i className="bi bi-shield-check text-gold-accent me-2"></i>Estado: <span className="text-white">{v.estado}</span></div>
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

      {/* Modal unificado con carga de fotografía */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-person-badge text-gold-accent me-2"></i>
            {editingId ? 'Editar Vendedor' : 'Registrar Vendedor'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <BarberPhotoUpload
              photo={formData.fotografia}
              onPhotoChange={(img) => setFormData({ ...formData, fotografia: img })}
            />
            <FormInputField
              id="v-name" label="Nombres" value={formData.nombres} placeholder="Ej: Michael Alexander" icon="bi-person" required
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
            />
            <Row className="g-2">
              <Col xs={12} sm={6}>
                <FormSelectField
                  id="v-sexo" label="Sexo" value={formData.sexo} options={genderOptions} icon="bi-gender-ambiguous" required
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                />
              </Col>
              <Col xs={12} sm={6}>
                <FormInputField
                  id="v-edad" label="Edad" type="number" value={formData.edad} placeholder="28" icon="bi-calendar-event" required
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                />
              </Col>
            </Row>
            <FormInputField
              id="v-phone" label="Teléfono" type="tel" value={formData.telefono} placeholder="+58 412 0000000" icon="bi-telephone" required
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">
              {editingId ? 'Guardar Cambios' : 'Guardar Vendedor'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default GestionVendedores;
