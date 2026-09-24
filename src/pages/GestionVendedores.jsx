import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

/**
 * Vista: GestionVendedores
 * Propósito: Listado, búsqueda y control de vendedores / barberos de Legendario.
 * Permite acceder al formulario unificado de creación y edición.
 */
const GestionVendedores = () => {
  const [search, setSearch] = useState('');

  // Lista de vendedores registrados en el sistema
  const [vendedores] = useState([
    { id: '1', nombres: 'Michael Rodríguez', sexo: 'Masculino', edad: 28, telefono: '+58 412 1234567', estado: 'Activo' },
    { id: '2', nombres: 'Alexander Salazar', sexo: 'Masculino', edad: 24, telefono: '+58 414 9876543', estado: 'Activo' },
    { id: '3', nombres: 'Valeria Mendoza', sexo: 'Femenino', edad: 26, telefono: '+58 424 5556677', estado: 'En Turno' },
    { id: '4', nombres: 'Carlos Gómez', sexo: 'Masculino', edad: 31, telefono: '+58 416 3334455', estado: 'Inactivo' }
  ]);

  // Filtrado reactivo por nombre
  const filtered = vendedores.filter((v) =>
    v.nombres.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout title="Gestión de Vendedores" subtitle="Administración de barberos y comisionistas">
      {/* Barra de herramientas: Búsqueda y Botón para agregar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <InputGroup style={{ maxWidth: '340px' }}>
          <InputGroup.Text className="bg-transparent border-subtle text-gold-accent">
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            className="dark-input"
            placeholder="Buscar vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <Link to="/barbers/new" className="btn btn-primary-gradient d-flex align-items-center gap-2">
          <i className="bi bi-person-plus-fill"></i>
          <span>Nuevo Vendedor</span>
        </Link>
      </div>

      {/* Cuadrícula de tarjetas de vendedores */}
      <Row className="g-3">
        {filtered.map((v) => (
          <Col xs={12} sm={6} lg={4} key={v.id}>
            <Card className="dark-card p-3 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="photo-upload-box" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-person-fill text-gold-accent fs-3"></i>
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
                <Link to={`/barbers/edit/${v.id}`} className="btn btn-outline-gold btn-sm px-3">
                  <i className="bi bi-pencil-square me-1"></i> Editar
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </MainLayout>
  );
};

export default GestionVendedores;
