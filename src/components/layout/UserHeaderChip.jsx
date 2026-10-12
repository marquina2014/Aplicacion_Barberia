import React, { useState, useEffect } from 'react';
import { obtenerUsuarioActual } from '../../utils/sesionUsuario';

/**
 * Componente: UserHeaderChip
 * Propósito: Muestra en el header el usuario logueado (foto, nombre y rol)
 * y se actualiza automáticamente cuando se edita su perfil o cambia de sesión.
 */
const UserHeaderChip = () => {
  const [usuario, setUsuario] = useState(() => obtenerUsuarioActual());

  useEffect(() => {
    const sync = () => setUsuario(obtenerUsuarioActual());
    window.addEventListener('sesion-actualizada', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('sesion-actualizada', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <div className="user-chip" title={`${usuario.nombre} · ${usuario.rol}`}>
      <div className="user-chip-avatar">
        {usuario.fotoUrl ? (
          <img src={usuario.fotoUrl} alt={usuario.nombre} className="photo-preview-img" />
        ) : (
          <i className="bi bi-person-fill text-gold-accent"></i>
        )}
      </div>
      <div className="user-chip-info d-none d-md-flex">
        <span className="user-chip-name">{usuario.nombre}</span>
        <span className="user-chip-role">{usuario.rol}</span>
      </div>
    </div>
  );
};

export default UserHeaderChip;
