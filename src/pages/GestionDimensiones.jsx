import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import TabServicios from '../components/dimensiones/TabServicios';
import TabMetodosPago from '../components/dimensiones/TabMetodosPago';
import TabFormulas from '../components/dimensiones/TabFormulas';

/**
 * Vista: GestionDimensiones
 * Propósito: Centraliza las dimensiones de negocio de la barbería:
 * - Servicios aplicados
 * - Métodos de pago (en Dólares y Bolívares)
 * - Fórmulas de cálculo de cortes
 */
const GestionDimensiones = () => {
  const [tabActiva, setTabActiva] = useState('servicios');

  return (
    <MainLayout
      title="Dimensiones"
      subtitle="Catálogos configurables: Servicios aplicados, Métodos de pago (Bs / $) y Fórmulas"
    >
      <div className="mb-4">
        <Nav variant="pills" className="d-flex flex-wrap gap-2 border-bottom border-gold pb-3">
          <Nav.Item>
            <Nav.Link
              active={tabActiva === 'servicios'}
              onClick={() => setTabActiva('servicios')}
              className={`d-flex align-items-center gap-2 px-3 py-2 ${
                tabActiva === 'servicios' ? 'btn-primary-gradient text-black fw-bold' : 'text-white'
              }`}
              style={{ cursor: 'pointer', borderRadius: '8px' }}
            >
              <i className="bi bi-scissors fs-5"></i>
              <span>Servicios Aplicados</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              active={tabActiva === 'metodos'}
              onClick={() => setTabActiva('metodos')}
              className={`d-flex align-items-center gap-2 px-3 py-2 ${
                tabActiva === 'metodos' ? 'btn-primary-gradient text-black fw-bold' : 'text-white'
              }`}
              style={{ cursor: 'pointer', borderRadius: '8px' }}
            >
              <i className="bi bi-wallet2 fs-5"></i>
              <span>Métodos de Pago (Bs / $)</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              active={tabActiva === 'formulas'}
              onClick={() => setTabActiva('formulas')}
              className={`d-flex align-items-center gap-2 px-3 py-2 ${
                tabActiva === 'formulas' ? 'btn-primary-gradient text-black fw-bold' : 'text-white'
              }`}
              style={{ cursor: 'pointer', borderRadius: '8px' }}
            >
              <i className="bi bi-calculator-fill fs-5"></i>
              <span>Fórmulas de Cálculo</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="mt-2">
        {tabActiva === 'servicios' && <TabServicios />}
        {tabActiva === 'metodos' && <TabMetodosPago />}
        {tabActiva === 'formulas' && <TabFormulas />}
      </div>
    </MainLayout>
  );
};

export default GestionDimensiones;
