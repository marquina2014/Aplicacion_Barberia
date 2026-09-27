import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

/**
 * Componente: FormInputField
 * Propósito: Campo de entrada reutilizable con soporte para iconos,
 * alternador de visibilidad de contraseña (show/hide), validación y estilo dark.
 * 
 * @param {Object} props
 * @param {string} props.id - Identificador único del campo
 * @param {string} props.label - Etiqueta descriptiva del campo
 * @param {string} [props.type="text"] - Tipo de input (text, email, password, etc.)
 * @param {string} props.value - Valor controlado del estado
 * @param {Function} props.onChange - Función manejadora de cambios
 * @param {string} [props.placeholder=""] - Texto orientativo de ayuda
 * @param {string} [props.icon] - Clase de icono de Bootstrap (ej. 'bi-envelope')
 * @param {string} [props.error] - Mensaje de error para retroalimentación
 * @param {boolean} [props.required=false] - Define si el campo es obligatorio
 */
const FormInputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon,
  error,
  required = false
}) => {
  // Estado local para alternar visibilidad en campos de tipo contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Determina el tipo dinámico si es un campo de contraseña
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <Form.Group className="mb-3" controlId={id}>
      {/* Etiqueta superior del campo */}
      {label && (
        <Form.Label className="text-secondary-custom fw-medium mb-1 small">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      {/* Grupo de entrada con iconos integrados */}
      <InputGroup>
        {/* Icono decorativo inicial si se especifica */}
        {icon && (
          <InputGroup.Text className="text-gold-accent px-3">
            <i className={`bi ${icon}`}></i>
          </InputGroup.Text>
        )}

        {/* Control de formulario estilizado con clases globales oscuras */}
        <Form.Control
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="dark-input"
          isInvalid={Boolean(error)}
        />

        {/* Botón para alternar visibilidad de contraseña si el tipo original es password */}
        {type === 'password' && (
          <Button
            variant="outline-secondary"
            className="text-gold-accent px-3"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </Button>
        )}

        {/* Mensaje de retroalimentación de error */}
        {error && (
          <Form.Control.Feedback type="invalid" className="d-block mt-1 small">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default FormInputField;
