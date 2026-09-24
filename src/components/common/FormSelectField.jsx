import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

/**
 * Componente: FormSelectField
 * Propósito: Selector desplegable reutilizable con soporte para iconos,
 * estilo visual oscuro y retroalimentación de validación.
 * 
 * @param {Object} props
 * @param {string} props.id - Identificador único del select
 * @param {string} props.label - Etiqueta superior del campo
 * @param {string} props.value - Opción actualmente seleccionada
 * @param {Function} props.onChange - Manejador de evento al cambiar valor
 * @param {Array<{value: string, label: string}>} props.options - Lista de opciones
 * @param {string} [props.placeholder="Seleccione..."] - Texto guía por defecto
 * @param {string} [props.icon] - Icono de Bootstrap (ej. 'bi-gender-ambiguous')
 * @param {string} [props.error] - Mensaje de validación en caso de error
 * @param {boolean} [props.required=false] - Indica si el campo es obligatorio
 */
const FormSelectField = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione...',
  icon,
  error,
  required = false
}) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      {/* Etiqueta descriptiva del campo */}
      {label && (
        <Form.Label className="text-secondary-custom fw-medium mb-1 small">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      {/* Grupo con icono y selector personalizado */}
      <InputGroup>
        {icon && (
          <InputGroup.Text className="bg-transparent border-subtle text-secondary-custom px-3">
            <i className={`bi ${icon}`}></i>
          </InputGroup.Text>
        )}

        <Form.Select
          value={value}
          onChange={onChange}
          className="dark-input"
          isInvalid={Boolean(error)}
        >
          {/* Opción vacía por defecto */}
          <option value="" disabled className="bg-dark text-muted">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark text-white">
              {opt.label}
            </option>
          ))}
        </Form.Select>

        {/* Mensaje de error si falla la validación */}
        {error && (
          <Form.Control.Feedback type="invalid" className="d-block mt-1 small">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default FormSelectField;
