import React, { useRef } from 'react';

/**
 * Componente: BarberPhotoUpload
 * Propósito: Selector y visor de fotografía para el barbero con borde circular
 * dorado, soporte para carga de archivo local y visualización previa inmediata.
 * 
 * @param {Object} props
 * @param {string|null} props.photo - URL o base64 de la fotografía seleccionada
 * @param {Function} props.onPhotoChange - Callback ejecutado con la nueva imagen (base64)
 * @param {string} [props.error] - Mensaje de validación de imagen
 */
const BarberPhotoUpload = ({ photo, onPhotoChange, error }) => {
  const fileInputRef = useRef(null);

  // Manejador del archivo seleccionado mediante input file nativo
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Conversión de archivo local a DataURL para vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      onPhotoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex flex-column align-items-center mb-4">
      {/* Caja circular con borde dorado para subir la foto */}
      <div
        className="photo-upload-box mb-2"
        onClick={() => fileInputRef.current?.click()}
        title="Haz clic para subir o cambiar fotografía"
      >
        {photo ? (
          <img src={photo} alt="Foto del barbero" className="photo-preview-img" />
        ) : (
          <div className="text-center p-2">
            <i className="bi bi-camera text-gold-accent fs-3 d-block mb-1"></i>
            <span className="small text-secondary-custom" style={{ fontSize: '0.72rem' }}>
              Subir Foto
            </span>
          </div>
        )}
      </div>

      {/* Input de archivo oculto activado por la caja */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="d-none"
      />

      <span className="small text-secondary-custom">
        {photo ? 'Haz clic para cambiar la foto' : 'Fotografía del Barbero (Opcional)'}
      </span>

      {error && <span className="text-danger small mt-1">{error}</span>}
    </div>
  );
};

export default BarberPhotoUpload;
