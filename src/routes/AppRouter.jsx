import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import GestionVendedores from '../pages/GestionVendedores';
import GestionClientes from '../pages/GestionClientes';
import VentasDia from '../pages/VentasDia';
import Historico from '../pages/Historico';
import BarberForm from '../pages/BarberForm';

/**
 * Componente: AppRouter
 * Propósito: Mapa centralizado de rutas de Legendario Barber Shop.
 * Define la navegación entre Login, Dashboard, Vendedores, Clientes,
 * Ventas del Día, Histórico y Formulario de Barberos.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendedores" element={<GestionVendedores />} />
        <Route path="/clientes" element={<GestionClientes />} />
        <Route path="/ventas-dia" element={<VentasDia />} />
        <Route path="/ventas/nueva" element={<Navigate to="/ventas-dia" replace />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/barbers/new" element={<BarberForm />} />
        <Route path="/barbers/edit/:id" element={<BarberForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
