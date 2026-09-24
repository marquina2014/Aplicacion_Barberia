import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Card, Container } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';
import FormInputField from '../components/common/FormInputField';
import FormSelectField from '../components/common/FormSelectField';
import BarberPhotoUpload from '../components/barber/BarberPhotoUpload';

/**
 * Vista: BarberForm
 * Propósito: Formulario unificado para CREAR o EDITAR barberos (Nombres, Sexo,
 * Edad, Teléfono y Fotografía). Interfaz idéntica en ambos modos.
 */
const BarberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nombres: '', sexo: '', edad: '', telefono: '', fotografia: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' }
  ];

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        nombres: 'Michael Rodríguez', sexo: 'Masculino',
        edad: '28', telefono: '+58 412 1234567', fotografia: null
      });
    }
  }, [isEditMode, id]);

  const update = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nombres.trim()) errs.nombres = 'Ingresa los nombres';
    if (!formData.sexo) errs.sexo = 'Selecciona el sexo';
    if (!formData.edad || isNaN(formData.edad) || Number(formData.edad) <= 0) errs.edad = 'Edad válida requerida';
    if (!formData.telefono.trim()) errs.telefono = 'Teléfono requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setNotification(isEditMode ? '¡Barbero actualizado!' : '¡Barbero registrado!');
      setTimeout(() => navigate('/dashboard'), 900);
    }, 600);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-ambient-glow" aria-hidden="true"></div>
      <div className="auth-ambient-glow-bottom" aria-hidden="true"></div>
      <Container className="d-flex justify-content-center">
        <Card className="dark-card form-barber-card">
          <div className="d-flex justify-content-center mb-3"><BrandLogo size="normal" /></div>
          <div className="text-center mb-3">
            <h4 className="fw-bold text-white mb-1">{isEditMode ? 'Editar Barbero' : 'Nuevo Barbero'}</h4>
            <p className="text-secondary-custom small mb-0">Gestión de profesionales de Legendario</p>
          </div>

          {notification && <Alert variant="success" className="py-2 small text-center">{notification}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <BarberPhotoUpload photo={formData.fotografia} onPhotoChange={(img) => update('fotografia', img)} />

            <FormInputField
              id="b-name" label="Nombres" value={formData.nombres}
              onChange={(e) => update('nombres', e.target.value)}
              placeholder="Ej: Michael Alexander" icon="bi-person" error={errors.nombres} required
            />

            <Row className="g-2">
              <Col xs={12} sm={6}>
                <FormSelectField
                  id="b-sexo" label="Sexo" value={formData.sexo}
                  onChange={(e) => update('sexo', e.target.value)}
                  options={genderOptions} icon="bi-gender-ambiguous" error={errors.sexo} required
                />
              </Col>
              <Col xs={12} sm={6}>
                <FormInputField
                  id="b-edad" label="Edad" type="number" value={formData.edad}
                  onChange={(e) => update('edad', e.target.value)}
                  placeholder="Ej: 26" icon="bi-calendar-event" error={errors.edad} required
                />
              </Col>
            </Row>

            <FormInputField
              id="b-phone" label="Teléfono" type="tel" value={formData.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              placeholder="+58 414 0000000" icon="bi-telephone" error={errors.telefono} required
            />

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" className="btn-primary-gradient flex-grow-1" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Registrar Barbero')}
              </Button>
              <Link to="/dashboard" className="btn btn-dark-secondary d-flex align-items-center">Cancelar</Link>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default BarberForm;
