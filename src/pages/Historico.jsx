import React, { useState } from 'react';
import { Nav, Table, Card } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';

/**
 * Vista: Historico
 * Propósito: Auditoría y registros históricos de ventas, vendedores y clientes.
 */
const Historico = () => {
  // Pestaña activa ('ventas' | 'vendedores' | 'clientes')
  const [tab, setTab] = useState('ventas');

  // Datos de auditoría para cada sección
  const ventas = [
    { id: '#V-103', fecha: '23/09/2026 18:30', barbero: 'Michael R.', cliente: 'Gabriel Torres', servicio: 'Combo Legendario', total: '$22.00', pago: 'Zelle' },
    { id: '#V-102', fecha: '23/09/2026 17:15', barbero: 'Alexander S.', cliente: 'José Díaz', servicio: 'Corte Clásico', total: '$15.00', pago: 'Efectivo' },
    { id: '#V-101', fecha: '23/09/2026 15:40', barbero: 'Valeria M.', cliente: 'Ricardo Peña', servicio: 'Perfilado Barba', total: '$10.00', pago: 'Pago Móvil' }
  ];

  const vendedores = [
    { id: '#B-04', fecha: '22/09/2026', nombre: 'Carlos Gómez', edad: 31, sexo: 'Masculino', telefono: '+58 416 3334455', rol: 'Barbero' },
    { id: '#B-03', fecha: '18/09/2026', nombre: 'Valeria Mendoza', edad: 26, sexo: 'Femenino', telefono: '+58 424 5556677', rol: 'Estilista' },
    { id: '#B-02', fecha: '15/09/2026', nombre: 'Alexander Salazar', edad: 24, sexo: 'Masculino', telefono: '+58 414 9876543', rol: 'Barbero' }
  ];

  const clientes = [
    { id: '#C-50', fecha: '23/09/2026', nombre: 'Gabriel Torres', telefono: '+58 412 8889900', visitas: 12, estado: 'Frecuente' },
    { id: '#C-49', fecha: '22/09/2026', nombre: 'José Manuel Díaz', telefono: '+58 414 7776655', visitas: 5, estado: 'Activo' },
    { id: '#C-48', fecha: '20/09/2026', nombre: 'Ricardo Peña', telefono: '+58 424 1112233', visitas: 8, estado: 'Activo' }
  ];

  return (
    <MainLayout title="Histórico y Auditoría" subtitle="Registro cronológico de actividades">
      {/* Selector de pestañas */}
      <Nav variant="pills" className="gap-2 mb-4">
        <Nav.Item>
          <Nav.Link active={tab === 'ventas'} onClick={() => setTab('ventas')} className={tab === 'ventas' ? 'btn-primary-gradient text-dark' : 'btn-dark-secondary'}>
            <i className="bi bi-cash-stack me-2"></i>Histórico de Ventas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tab === 'vendedores'} onClick={() => setTab('vendedores')} className={tab === 'vendedores' ? 'btn-primary-gradient text-dark' : 'btn-dark-secondary'}>
            <i className="bi bi-scissors me-2"></i>Histórico Vendedores
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tab === 'clientes'} onClick={() => setTab('clientes')} className={tab === 'clientes' ? 'btn-primary-gradient text-dark' : 'btn-dark-secondary'}>
            <i className="bi bi-people me-2"></i>Histórico Clientes
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tablas de contenido según la pestaña activa */}
      <Card className="dark-card p-3">
        <Table responsive hover variant="dark" className="m-0 bg-transparent align-middle">
          <thead>
            <tr className="border-bottom border-gold text-gold-accent">
              <th>ID</th><th>Fecha</th><th>Nombre / Ref</th><th>Detalle / Servicio</th><th>Total / Contacto</th>
            </tr>
          </thead>
          <tbody>
            {tab === 'ventas' && ventas.map((v) => (
              <tr key={v.id} className="border-bottom border-subtle">
                <td className="fw-bold text-gold-accent">{v.id}</td><td>{v.fecha}</td>
                <td>{v.cliente} <small className="text-muted-custom">({v.barbero})</small></td>
                <td>{v.servicio}</td><td className="fw-bold text-white">{v.total} ({v.pago})</td>
              </tr>
            ))}
            {tab === 'vendedores' && vendedores.map((b) => (
              <tr key={b.id} className="border-bottom border-subtle">
                <td className="fw-bold text-gold-accent">{b.id}</td><td>{b.fecha}</td>
                <td>{b.nombre}</td><td>{b.sexo} • {b.edad} años</td><td>{b.telefono}</td>
              </tr>
            ))}
            {tab === 'clientes' && clientes.map((c) => (
              <tr key={c.id} className="border-bottom border-subtle">
                <td className="fw-bold text-gold-accent">{c.id}</td><td>{c.fecha}</td>
                <td>{c.nombre}</td><td>{c.visitas} visitas registradas</td><td>{c.telefono}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </MainLayout>
  );
};

export default Historico;
