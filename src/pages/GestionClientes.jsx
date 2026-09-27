import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';

/**
 * Vista: GestionClientes
 * Propósito: Listado, registro rápido y seguimiento de clientes de la barbería.
 */
const GestionClientes = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Lista de clientes
  const [clientes, setClientes] = useState([
    { id: 1, nombres: 'Gabriel Torres', telefono: '+58 412 8889900', visitas: 12, ultimo: 'Corte Degradado' },
    { id: 2, nombres: 'José Manuel Díaz', telefono: '+58 414 7776655', visitas: 5, ultimo: 'Barba y Perfilado' },
    { id: 3, nombres: 'Ricardo Peña', telefono: '+58 424 1112233', visitas: 8, ultimo: 'Combo Legendario' }
  ]);

  // Formulario de nuevo cliente
  const [newClient, setNewClient] = useState({ nombres: '', telefono: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!newClient.nombres || !newClient.telefono) return;
    setClientes([...clientes, { id: Date.now(), ...newClient, visitas: 1, ultimo: 'Nuevo Registro' }]);
    setNewClient({ nombres: '', telefono: '' });
    setShowModal(false);
  };

  const filtered = clientes.filter((c) =>
    c.nombres.toLowerCase().includes(search.toLowerCase()) || c.telefono.includes(search)
  );

  return (
    <MainLayout title="Gestión de Clientes" subtitle="Directorio y fidelidad de clientes">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <InputGroup style={{ maxWidth: '340px' }}>
          <InputGroup.Text className="text-gold-accent"><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control
            type="text" className="dark-input" placeholder="Buscar por nombre o teléfono..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button className="btn-primary-gradient d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill"></i><span>Registrar Cliente</span>
        </Button>
      </div>

      <Row className="g-3">
        {filtered.map((c) => (
          <Col xs={12} sm={6} lg={4} key={c.id}>
            <Card className="dark-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold text-white m-0">{c.nombres}</h6>
                <span className="badge-pill-custom">{c.visitas} visitas</span>
              </div>
              <small className="text-secondary-custom d-block mb-2">
                <i className="bi bi-telephone text-gold-accent me-1"></i>{c.telefono}
              </small>
              <div className="border-top border-subtle pt-2 mt-auto text-end">
                <small className="text-muted-custom">Último: <span className="text-gold-accent">{c.ultimo}</span></small>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para nuevo cliente: diseño oscuro idéntico a nuevo barbero */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-card">
        <Modal.Header closeButton closeVariant="white" className="border-gold">
          <Modal.Title className="text-white fw-bold fs-5">
            <i className="bi bi-person-plus text-gold-accent me-2"></i>Registrar Cliente
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <FormInputField
              id="c-name"
              label="Nombre Completo"
              value={newClient.nombres}
              onChange={(e) => setNewClient({ ...newClient, nombres: e.target.value })}
              placeholder="Ej: Fernando Ruiz"
              icon="bi-person"
              required
            />
            <FormInputField
              id="c-phone"
              label="Teléfono de Contacto"
              type="tel"
              value={newClient.telefono}
              onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
              placeholder="+58 412 0000000"
              icon="bi-telephone"
              required
            />
          </Modal.Body>
          <Modal.Footer className="border-gold">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-primary-gradient px-4">Guardar Cliente</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default GestionClientes;
