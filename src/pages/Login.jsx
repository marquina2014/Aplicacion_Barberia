import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import FormInputField from '../components/common/FormInputField';
import { getVendedores } from '../services/api';
import { guardarUsuarioActual } from '../utils/sesionUsuario';

/**
 * Vista: Login
 * Propósito: Pantalla de inicio de sesión de Legendario Barber Shop.
 * Autentica por Nombre de Usuario (o correo) y Contraseña contra JSON Server.
 */
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ usuario: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.usuario.trim()) {
      errs.usuario = 'Introduce tu nombre de usuario';
    }
    if (!formData.password) {
      errs.password = 'Introduce tu contraseña';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const lista = await getVendedores();
    const userKey = formData.usuario.trim().toLowerCase();
    const encontrado = lista.find(
      (v) =>
        (v.usuario || '').toLowerCase() === userKey ||
        (v.email || '').toLowerCase() === userKey
    );

    if (!encontrado || (encontrado.password && String(encontrado.password) !== String(formData.password))) {
      setErrors({ password: 'Usuario o contraseña incorrectos' });
      setIsSubmitting(false);
      return;
    }
    if (encontrado.estado === false) {
      setErrors({ usuario: 'Este usuario se encuentra inactivo' });
      setIsSubmitting(false);
      return;
    }

    guardarUsuarioActual(encontrado);
    setIsSubmitting(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout
      title="Acceso al Sistema"
      subtitle="Panel de administración de Legendario Barber Shop"
    >
      <Form onSubmit={handleSubmit} noValidate>
        {/* Campo de Nombre de Usuario */}
        <FormInputField
          id="login-usuario"
          label="Nombre de Usuario"
          type="text"
          value={formData.usuario}
          onChange={(e) => {
            setFormData({ ...formData, usuario: e.target.value });
            if (errors.usuario) setErrors({ ...errors, usuario: null });
          }}
          placeholder="Ej: Marquina2014"
          icon="bi-person"
          error={errors.usuario}
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
