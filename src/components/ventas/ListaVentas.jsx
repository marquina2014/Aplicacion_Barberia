import React from 'react';
import { Table } from 'react-bootstrap';

/**
 * Componente: ListaVentas
 * Propósito: Lista de ventas compartida por "Ventas del Día" e "Histórico".
 * - PC / tablet (>= 768px): tabla completa en negro puro.
 * - Celular (< 768px): tarjetas apiladas, sin scroll horizontal.
 *
 * @param {Object} props
 * @param {Array} props.ventas - Ventas ya filtradas a mostrar
 */
const ListaVentas = ({ ventas }) => {
  // Estado vacío compartido por ambas vistas
  if (ventas.length === 0) {
    return (
      <div className="table-container-card p-4 text-center text-muted-custom">
        <i className="bi bi-inbox fs-3 d-block mb-2"></i>
        No se encontraron ventas con los filtros aplicados.
      </div>
    );
  }

  return (
    <>
      {/* Vista PC: tabla completa */}
      <div className="table-container-card p-3 d-none d-md-block">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Fecha y Hora</th><th>Vendedor</th><th>Cliente</th>
              <th>Servicio</th><th>Total</th><th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id}>
                <td className="fw-bold text-gold-accent">{v.id}</td>
                <td>{v.fechaHora}</td>
                <td className="fw-semibold text-white">
                  <i className="bi bi-person-badge text-gold-accent me-2"></i>{v.vendedor}
                </td>
                <td>{v.cliente}</td>
                <td><span className="service-pill">{v.servicio}</span></td>
                <td className="fw-bold text-white">${v.monto.toFixed(2)}</td>
                <td>
                  <span className="text-gold-accent small">
                    <i className="bi bi-credit-card me-1"></i>{v.pago}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Vista celular: una tarjeta por venta */}
      <div className="d-md-none d-flex flex-column gap-3">
        {ventas.map((v) => (
          <div key={v.id} className="venta-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-gold-accent">{v.id}</span>
              <small className="text-secondary-custom">{v.fechaHora}</small>
            </div>
            <h6 className="fw-bold text-white mb-1">
              <i className="bi bi-person text-gold-accent me-2"></i>{v.cliente}
            </h6>
            <small className="text-secondary-custom d-block mb-2">
              <i className="bi bi-person-badge text-gold-accent me-2"></i>{v.vendedor}
            </small>
            <span className="service-pill">{v.servicio}</span>
            <div className="venta-card-footer">
              <span className="text-gold-accent small">
                <i className="bi bi-credit-card me-1"></i>{v.pago}
              </span>
              <span className="fw-bold text-white fs-5">${v.monto.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListaVentas;
