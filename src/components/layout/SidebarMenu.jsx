import React from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';

/**
 * Componente: SidebarMenu (Menú Lateral)
 * Propósito: Componente modular "menu" extraído según la primera imagen.
 * Contiene el logo oficial de Legendario y la navegación principal del sistema.
 */
const SidebarMenu = () => {
  // Configuración de los ítems de navegación requeridos
  const menuItems = [
    { to: '/dashboard', label: 'Inicio', icon: 'bi-grid-fill' },
    { to: '/vendedores', label: 'Gestión Vendedores', icon: 'bi-scissors' },
    { to: '/clientes', label: 'Gestión Clientes', icon: 'bi-people-fill' },
    { to: '/ventas/nueva', label: 'Nueva Venta', icon: 'bi-cash-coin' },
    { to: '/historico', label: 'Histórico', icon: 'bi-clock-history' }
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* 1. Logotipo oficial Legendario Barber Shop en la cabecera del menú */}
      <div className="mb-4 pb-3 border-bottom border-gold d-flex justify-content-center">
        <BrandLogo size="normal" />
      </div>

      {/* 2. Título de sección idéntico a la imagen de referencia */}
      <span className="text-secondary-custom small text-uppercase fw-bold mb-3 px-2" style={{ letterSpacing: '1.5px' }}>
        Panel Legendario
      </span>

      {/* 3. Lista de enlaces de navegación con estado activo dorado */}
      <nav className="d-flex flex-column gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span className="small fw-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
