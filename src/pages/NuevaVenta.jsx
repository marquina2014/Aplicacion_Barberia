import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FormInputField from '../components/common/FormInputField';
import FormSelectField from '../components/common/FormSelectField';

/**
 * Vista: NuevaVenta
 * Propósito: Registro de nueva venta/servicio en Legendario Barber Shop.
 * Vincula vendedor (barbero), cliente, servicio realizado, monto y forma de pago.
 */
const NuevaVenta = () => {
  const navigate = useNavigate();

  // Estado del formulario de venta
  const [venta, setVenta] = useState({
    vendedor: '', cliente: '', servicio: 'Corte Clásico', monto: '15.00', metodoPago: 'Efectivo', notas: ''
  });
  const [success, setSuccess] = useState(false);

  // Opciones de barberos y métodos de pago
  const vendedores = [
    { value: 'Michael Rodríguez', label: 'Michael Rodríguez' },
    { value: 'Alexander Salazar', label: 'Alexander Salazar' },
    { value: 'Valeria Mendoza', label: 'Valeria Mendoza' }
  ];

  const servicios = [
    { value: 'Corte Clásico', label: 'Corte Clásico ($15)' },
    { value: 'Perfilado de Barba', label: 'Perfilado de Barba ($10)' },
    { value: 'Combo Legendario (Corte + Barba)', label: 'Combo Legendario ($22)' },
    { value: 'Tratamiento Capilar / Lavado', label: 'Tratamiento Capilar ($12)' }
  ];

  const metodos = [
    { value: 'Efectivo', label: 'Efectivo (USD / Bs)' },
    { value: 'Pago Móvil', label: 'Pago Móvil' },
    { value: 'Tarjeta Débito/Crédito', label: 'Punto de Venta / Tarjeta' },
    { value: 'Zelle', label: 'Zelle' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!venta.vendedor || !venta.cliente) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/historico');
    }, 1000);
  };

  return (
    <MainLayout title="Nuevo Registro (Nueva Venta)" subtitle="Factura y registra servicios realizados">
      <div className="d-flex justify-content-center">
        <Card className="dark-card p-4" style={{ maxWidth: '650px', width: '100%' }}>
          {success && <Alert variant="success" className="py-2 text-center small">¡Venta registrada con éxito!</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Vendedor y Cliente */}
            <Row className="g-2">
              <Col xs={12} sm={6}>
                <FormSelectField
                  id="v-barbero" label="Barbero (Vendedor)" value={venta.vendedor}
                  onChange={(e) => setVenta({ ...venta, vendedor: e.target.value })}
                  options={vendedores} icon="bi-scissors" required
                />
              </Col>
              <Col xs={12} sm={6}>
                <FormInputField
                  id="v-cliente" label="Nombre del Cliente" value={venta.cliente}
                  onChange={(e) => setVenta({ ...venta, cliente: e.target.value })}
                  placeholder="Ej: Gabriel Torres" icon="bi-person" required
                />
              </Col>
            </Row>

            {/* Servicio y Monto */}
            <Row className="g-2">
              <Col xs={12} sm={8}>
                <FormSelectField
                  id="v-servicio" label="Servicio Realizado" value={venta.servicio}
                  onChange={(e) => setVenta({ ...venta, servicio: e.target.value })}
                  options={servicios} icon="bi-tag" required
                />
              </Col>
              <Col xs={12} sm={4}>
                <FormInputField
                  id="v-monto" label="Monto ($)" type="number" value={venta.monto}
                  onChange={(e) => setVenta({ ...venta, monto: e.target.value })}
                  placeholder="15.00" icon="bi-currency-dollar" required
                />
              </Col>
            </Row>

            {/* Método de Pago */}
            <FormSelectField
              id="v-metodo" label="Método de Pago" value={venta.metodoPago}
              onChange={(e) => setVenta({ ...venta, metodoPago: e.target.value })}
              options={metodos} icon="bi-credit-card" required
            />

            {/* Botón de guardar venta */}
            <Button type="submit" className="btn-primary-gradient w-100 py-2 mt-3">
              <i className="bi bi-check-circle-fill me-2"></i>Registrar Venta
            </Button>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NuevaVenta;
