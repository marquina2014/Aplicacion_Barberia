import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import { esAdministrador } from '../../utils/sesionUsuario';

/**
 * Componente: SidebarMenu (Menú Lateral)
 * Propósito: Muestra la navegación principal del sistema.
 * Oculta Gestión de Vendedores y Gestión de Clientes para el rol 'barbero'.
 */
const SidebarMenu = ({ onNavigate, isMobile = false }) => {
  const [esAdmin, setEsAdmin] = useState(() => esAdministrador());

  useEffect(() => {
    const sync = () => setEsAdmin(esAdministrador());
    window.addEventListener('sesion-actualizada', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('sesion-actualizada', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const allItems = [
    { to: '/dashboard', label: 'Inicio', icon: 'bi-grid-fill', adminOnly: false },
    { to: '/vendedores', label: 'Gestión Barberos', icon: 'bi-scissors', adminOnly: true },
    { to: '/clientes', label: 'Gestión Clientes', icon: 'bi-people-fill', adminOnly: true },
    { to: '/formulas', label: 'Fórmulas', icon: 'bi-calculator-fill', adminOnly: true },
    { to: '/ventas-dia', label: 'Ventas del Día', icon: 'bi-calendar2-day-fill', adminOnly: false },
    { to: '/historico', label: 'Histórico', icon: 'bi-clock-history', adminOnly: false }
  ];

  const menuItems = allItems.filter((item) => !item.adminOnly || esAdmin);

  const content = (
    <>
      <div className="mb-4 pb-3 border-bottom border-gold d-flex justify-content-center">
        <BrandLogo size="menu" />
      </div>

      <span className="text-secondary-custom small text-uppercase fw-bold mb-3 px-2" style={{ letterSpacing: '1.5px' }}>
        Panel Legendario
      </span>

      <nav className="d-flex flex-column gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onNavigate && onNavigate()}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span className="small fw-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );

  if (isMobile) {
    return <div className="sidebar-mobile-inner">{content}</div>;
  }

  return (
    <aside className="dashboard-sidebar">
      {content}
    </aside>
  );
};

export default SidebarMenu;
