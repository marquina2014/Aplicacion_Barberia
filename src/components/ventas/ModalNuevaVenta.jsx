import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormInputField from '../common/FormInputField';
import FormSelectField from '../common/FormSelectField';

/**
 * Componente: ModalNuevaVenta
 * Propósito: Ventana modal emergente para registrar ventas rápidamente
 * desde las pantallas de "Ventas del Día" e "Histórico".
 * 
 * @param {Object} props
 * @param {boolean} props.show - Controla la visibilidad del modal
 * @param {Function} props.onHide - Cierra el modal
 * @param {Function} props.onSave - Callback al guardar la nueva venta
 */
const ModalNuevaVenta = ({ show, onHide, onSave }) => {
  // Estado local para los datos de la venta
  const [form, setForm] = useState({
    vendedor: 'Michael Rodríguez',
    cliente: '',
    servicio: 'Corte Clásico',
    monto: '15.00',
    metodoPago: 'Efectivo'
  });

  const vendedores = [
    { value: 'Michael Rodríguez', label: 'Michael Rodríguez' },
    { value: 'Alexander Salazar', label: 'Alexander Salazar' },
    { value: 'Valeria Mendoza', label: 'Valeria Mendoza' },
    { value: 'Carlos Gómez', label: 'Carlos Gómez' }
  ];

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

  // Envío del formulario del modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente.trim()) return;

    onSave({
      id: `#V-${Math.floor(100 + Math.random() * 900)}`,
      fechaHora: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fechaISO: new Date().toISOString().split('T')[0],
      vendedor: form.vendedor,
      cliente: form.cliente,
      servicio: form.servicio,
      monto: parseFloat(form.monto) || 15.0,
      pago: form.metodoPago
    });

    setForm({ vendedor: 'Michael Rodríguez', cliente: '', servicio: 'Corte Clásico', monto: '15.00', metodoPago: 'Efectivo' });
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
                id="mv-vendedor" label="Barbero (Vendedor)" value={form.vendedor}
                onChange={(e) => setForm({ ...form, vendedor: e.target.value })}
                options={vendedores} icon="bi-scissors" required
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
