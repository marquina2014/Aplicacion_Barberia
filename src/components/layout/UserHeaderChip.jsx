import React from 'react';
import { obtenerUsuarioActual } from '../../utils/sesionUsuario';

/**
 * Componente: UserHeaderChip
 * Propósito: Muestra en el header el usuario logueado (foto, nombre y rol).
 * En móvil se reduce a la foto para ahorrar espacio.
 */
const UserHeaderChip = () => {
  const { nombre, rol, fotoUrl } = obtenerUsuarioActual();

  return (
    <div className="user-chip" title={`${nombre} · ${rol}`}>
      <div className="user-chip-avatar">
        {fotoUrl ? (
          <img src={fotoUrl} alt={nombre} className="photo-preview-img" />
        ) : (
          <i className="bi bi-person-fill text-gold-accent"></i>
        )}
      </div>
      <div className="user-chip-info d-none d-md-flex">
        <span className="user-chip-name">{nombre}</span>
        <span className="user-chip-role">{rol}</span>
      </div>
    </div>
  );
};

export default UserHeaderChip;
