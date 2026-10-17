import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import GestionVendedores from '../pages/GestionVendedores';
import GestionClientes from '../pages/GestionClientes';
import GestionDimensiones from '../pages/GestionDimensiones';
import VentasDia from '../pages/VentasDia';
import Historico from '../pages/Historico';
import BarberForm from '../pages/BarberForm';
import { esAdministrador, tieneSesionActiva } from '../utils/sesionUsuario';

/**
 * Guardia de ruta pública (Login): si ya tiene JWT activo, redirige a /dashboard
 * reemplazando el historial para que el botón "Atrás" nunca devuelva al login.
 */
const RutaPublica = ({ children }) =>
  tieneSesionActiva() ? <Navigate to="/dashboard" replace /> : children;

/**
 * Guardia de ruta protegida: exige JWT vigente y valida rol de administrador si aplica.
 */
const RutaProtegida = ({ children, soloAdmin = false }) => {
  if (!tieneSesionActiva()) return <Navigate to="/login" replace />;
  if (soloAdmin && !esAdministrador()) return <Navigate to="/dashboard" replace />;
  return children;
};

/**
 * Componente: AppRouter
 * Propósito: Mapa centralizado de rutas de Legendario Barber Shop.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={tieneSesionActiva() ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/vendedores" element={<RutaProtegida soloAdmin><GestionVendedores /></RutaProtegida>} />
        <Route path="/clientes" element={<RutaProtegida soloAdmin><GestionClientes /></RutaProtegida>} />
        <Route path="/dimensiones" element={<RutaProtegida soloAdmin><GestionDimensiones /></RutaProtegida>} />
        <Route path="/formulas" element={<Navigate to="/dimensiones" replace />} />
        <Route path="/ventas-dia" element={<RutaProtegida><VentasDia /></RutaProtegida>} />
        <Route path="/ventas/nueva" element={<Navigate to="/ventas-dia" replace />} />
        <Route path="/historico" element={<RutaProtegida><Historico /></RutaProtegida>} />
        <Route path="/barbers/new" element={<RutaProtegida soloAdmin><BarberForm /></RutaProtegida>} />
        <Route path="/barbers/edit/:id" element={<RutaProtegida soloAdmin><BarberForm /></RutaProtegida>} />
        <Route path="*" element={<Navigate to={tieneSesionActiva() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

gexport default AppRouter;
