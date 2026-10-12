import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';
import { getLocalDateISO } from '../../utils/dateUtils';
import { getVendedores } from '../../services/api';
import { obtenerUsuarioActual, esAdministrador } from '../../utils/sesionUsuario';

/**
 * Componente: ModalNuevaVenta
 * Propósito: Ventana modal emergente para registrar ventas rápidamente
 * desde las pantallas de "Ventas del Día", "Histórico" y "Dashboard".
 */
const ModalNuevaVenta = ({ show, onHide, onSave }) => {
  const usuario = obtenerUsuarioActual();
  const esAdmin = esAdministrador(usuario);

  const [form, setForm] = useState({
    vendedor: esAdmin ? 'luis marquina' : usuario.nombre,
    cliente: '',
    servicio: 'Corte Clásico',
    monto: '15.00',
    metodoPago: 'Efectivo'
  });

  const [vendedores, setVendedores] = useState([
    { value: 'luis marquina', label: 'luis marquina' },
    { value: 'Sofia marcano', label: 'Sofia marcano' }
  ]);

  useEffect(() => {
    if (show) {
      const actual = obtenerUsuarioActual();
      const admin = esAdministrador(actual);
      getVendedores().then((lista) => {
        if (lista?.length) {
          setVendedores(lista.map((v) => ({ value: v.nombres, label: v.nombres })));
          setForm((prev) => ({
            ...prev,
            vendedor: admin ? (prev.vendedor || lista[0].nombres) : actual.nombre
          }));
        }
      });
    }
  }, [show]);

  const servicios = [
    { value: 'Corte Clásico', label: 'Corte Clásico ($15)' },
    { value: 'Perfilado de Barba', label: 'Perfilado de Barba ($10)' },
    { value: 'Combo Legendario', label: 'Combo Legendario ($22)' },
    { value: 'Tratamiento Capilar', label: 'Tratamiento Capilar ($12)' }
  ];

  const metodos = [
    { value: 'Efectivo', label: 'Efectivo (USD / Bs)' },
    { value: 'Pago Móvil', label: 'Pago Móvil' },
    { value: 'Tarjeta', label: 'Punto de Venta / Tarjeta' },
    { value: 'Zelle', label: 'Zelle' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente.trim()) return;

    onSave({
      id: `#V-${Math.floor(100 + Math.random() * 900)}`,
      fechaHora: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fechaISO: getLocalDateISO(),
      vendedor: esAdmin ? form.vendedor : usuario.nombre,
      cliente: form.cliente,
      servicio: form.servicio,
      monto: parseFloat(form.monto) || 15.0,
      pago: form.metodoPago
    });

    setForm({
      vendedor: esAdmin ? 'luis marquina' : usuario.nombre,
      cliente: '',
      servicio: 'Corte Clásico',
      monto: '15.00',
      metodoPago: 'Efectivo'
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="dark-card">
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-5">
          <i className="bi bi-cash-coin text-gold-accent me-2"></i>Registrar Nueva Venta
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField
                id="mv-vendedor" label="Barbero (Vendedor)" value={esAdmin ? form.vendedor : usuario.nombre}
                onChange={(e) => setForm({ ...form, vendedor: e.target.value })}
                options={vendedores} icon="bi-scissors" disabled={!esAdmin} required
              />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField
                id="mv-cliente" label="Nombre del Cliente" value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                placeholder="Ej: Daniel Castillo" icon="bi-person" required
              />
            </Col>
          </Row>

          <Row className="g-2">
            <Col xs={12} sm={6}>
              <FormSelectField
                id="mv-servicio" label="Servicio Realizado" value={form.servicio}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                options={servicios} icon="bi-tag" required
              />
            </Col>
            <Col xs={12} sm={6}>
              <FormInputField
                id="mv-monto" label="Monto ($)" type="number" value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                placeholder="15.00" icon="bi-currency-dollar" required
              />
            </Col>
          </Row>

          <FormSelectField
            id="mv-metodo" label="Método de Pago" value={form.metodoPago}
            onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
            options={metodos} icon="bi-credit-card" required
          />
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
