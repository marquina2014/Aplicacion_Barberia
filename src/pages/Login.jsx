import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import FormInputField from '../components/common/FormInputField';
import { loginUsuario } from '../services/api';
import { guardarUsuarioActual } from '../utils/sesionUsuario';
import {
  obtenerEstadoSeguridadLogin,
  registrarFalloLogin,
  resetearIntentosLogin
} from '../utils/seguridadLogin';

/**
 * Vista: Login
 * Propósito: Acceso con protección anti-fuerza bruta y almacenamiento cifrado.
 */
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usuario: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seguridad, setSeguridad] = useState(obtenerEstadoSeguridadLogin);

  useEffect(() => {
    if (!seguridad.bloqueado) return;
    const interval = setInterval(() => {
      const estado = obtenerEstadoSeguridadLogin();
      setSeguridad(estado);
      if (!estado.bloqueado) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [seguridad.bloqueado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.usuario.trim()) errs.usuario = 'Introduce tu nombre de usuario';
    if (!formData.password) errs.password = 'Introduce tu contraseña';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sec = obtenerEstadoSeguridadLogin();
    if (sec.bloqueado) {
      setErrors({ password: `Acceso bloqueado por seguridad. Espere ${sec.segundosRestantes} segundos.` });
      return;
    }
    if (!validateForm()) return;
    setIsSubmitting(true);

    const res = await loginUsuario(formData.usuario, formData.password);
    if (!res.ok) {
      const nuevoSec = registrarFalloLogin();
      setSeguridad(nuevoSec);
      if (nuevoSec.bloqueado) {
        setErrors({ password: `Demasiados intentos fallidos. Bloqueado temporalmente por ${nuevoSec.segundosRestantes}s.` });
      } else {
        setErrors({
          password: `${res.error || 'Usuario o contraseña incorrectos'} (${nuevoSec.intentosRestantes} intentos restantes)`
        });
      }
      setIsSubmitting(false);
      return;
    }

    resetearIntentosLogin();
    guardarUsuarioActual(res.usuario);
    setIsSubmitting(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout title="Acceso al Sistema" subtitle="Panel de administración de Legendario Barber Shop">
      <Form onSubmit={handleSubmit} noValidate>
        {seguridad.bloqueado && (
          <div className="alert alert-danger py-2 px-3 small border border-danger mb-3 d-flex align-items-center rounded" style={{ background: '#250808', color: '#ff8585' }}>
            <i className="bi bi-shield-lock-fill fs-5 me-2 text-danger"></i>
            <span><strong>Protección anti-fuerza bruta activa:</strong> Intente de nuevo en <strong>{seguridad.segundosRestantes}s</strong>.</span>
          </div>
        )}

        <FormInputField
          id="login-usuario" label="Nombre de Usuario" type="text"
          value={formData.usuario}
          onChange={(e) => {
            setFormData({ ...formData, usuario: e.target.value });
            if (errors.usuario) setErrors({ ...errors, usuario: null });
          }}
          placeholder="Ej: usuario o correo" icon="bi-person" error={errors.usuario} required disabled={seguridad.bloqueado}
        />

        <FormInputField
          id="login-password" label="Contraseña" type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          placeholder="••••••••" icon="bi-lock" error={errors.password} required disabled={seguridad.bloqueado}
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check
            type="checkbox" id="remember-me" label="Recordarme"
            checked={formData.rememberMe} onChange={handleChange} name="rememberMe" className="dark-check"
          />
          <a href="#recuperar" className="accent-link small">¿Olvidaste tu contraseña?</a>
        </div>

        <Button type="submit" className="btn-primary-gradient w-100 py-2 mt-2" disabled={isSubmitting || seguridad.bloqueado}>
          {seguridad.bloqueado ? (
            <span><i className="bi bi-lock-fill me-2"></i>Bloqueado ({seguridad.segundosRestantes}s)</span>
          ) : isSubmitting ? (
            <span><i className="bi bi-arrow-repeat spinner-border spinner-border-sm me-2"></i>Verificando...</span>
          ) : (
            'Ingresar a Legendario'
          )}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Login;
