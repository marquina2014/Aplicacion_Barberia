import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import FormInputField from '../components/common/FormInputField';

/**
 * Vista: Login
 * Propósito: Pantalla de inicio de sesión de Legendario Barber Shop.
 * Tema: Negro, Blanco y Dorado. No incluye enlaces de registro según instrucción.
 */
const Login = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Validación de credenciales
  const validateForm = () => {
    const errs = {};
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Introduce un correo electrónico válido';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <AuthLayout
      title="Acceso al Sistema"
      subtitle="Panel de administración de Legendario Barber Shop"
    >
      <Form onSubmit={handleSubmit} noValidate>
        {/* Campo de Correo Electrónico */}
        <FormInputField
          id="login-email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          placeholder="admin@legendario.com"
          icon="bi-envelope"
          error={errors.email}
          required
        />

        {/* Campo de Contraseña */}
        <FormInputField
          id="login-password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          placeholder="••••••••"
          icon="bi-lock"
          error={errors.password}
          required
        />

        {/* Recordarme y Olvidé Contraseña */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check
            type="checkbox"
            id="remember-me"
            label="Recordarme"
            checked={formData.rememberMe}
            onChange={handleChange}
            name="rememberMe"
            className="dark-check"
          />
          <a href="#recuperar" className="accent-link small">¿Olvidaste tu contraseña?</a>
        </div>

        {/* Botón dorado de ingreso */}
        <Button
          type="submit"
          className="btn-primary-gradient w-100 py-2 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              <i className="bi bi-arrow-repeat spinner-border spinner-border-sm me-2"></i>
              Verificando...
            </span>
          ) : (
            'Ingresar a Legendario'
          )}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Login;
