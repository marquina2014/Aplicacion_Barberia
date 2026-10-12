import React from 'react';
import { Table } from 'react-bootstrap';
import { calcularMontoFinal, FORMULA_INICIAL } from '../../utils/formulasUtils';

/**
 * Componente: ListaVentas
 * Propósito: Lista de ventas compartida por "Ventas del Día", "Histórico" y "Fórmulas".
 * - Muestra Monto Original y Monto Final (calculado según la fórmula activa).
 */
const ListaVentas = ({ ventas, formula = FORMULA_INICIAL }) => {
  if (ventas.length === 0) {
    return (
      <div className="table-container-card p-4 text-center text-muted-custom">
        <i className="bi bi-inbox fs-3 d-block mb-2"></i>
        No se encontraron ventas con los filtros aplicados.
      </div>
    );
  }

  const obtenerFinal = (v) =>
    v.montoFinal !== undefined ? Number(v.montoFinal) : calcularMontoFinal(v.monto, formula);

  return (
    <>
      <div className="table-container-card p-3 d-none d-md-block">
        <Table responsive hover className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Vendedor</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Monto Original</th>
              <th>Monto Final</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => {
              const montoOrig = Number(v.monto || 0);
              const montoFin = obtenerFinal(v);
              return (
                <tr key={v.id}>
                  <td className="fw-bold text-gold-accent">{v.id}</td>
                  <td>{v.fechaHora}</td>
                  <td className="fw-semibold text-white">
                    <i className="bi bi-person-badge text-gold-accent me-2"></i>{v.vendedor}
                  </td>
                  <td>{v.cliente}</td>
                  <td><span className="service-pill">{v.servicio}</span></td>
                  <td className="fw-semibold text-secondary-custom">${montoOrig.toFixed(2)}</td>
                  <td className="fw-bold text-gold-accent">${montoFin.toFixed(2)}</td>
                  <td>
                    <span className="text-gold-accent small">
                      <i className="bi bi-credit-card me-1"></i>{v.pago}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className="d-md-none d-flex flex-column gap-3">
        {ventas.map((v) => {
          const montoOrig = Number(v.monto || 0);
          const montoFin = obtenerFinal(v);
          return (
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
              <div className="d-flex justify-content-between align-items-center">
                <span className="service-pill">{v.servicio}</span>
                <span className="text-gold-accent small">
                  <i className="bi bi-credit-card me-1"></i>{v.pago}
                </span>
              </div>
              <div className="venta-card-footer">
                <div>
                  <small className="text-secondary-custom d-block">Monto Original</small>
                  <span className="fw-semibold text-white">${montoOrig.toFixed(2)}</span>
                </div>
                <div className="text-end">
                  <small className="text-secondary-custom d-block">Monto Final (Barbero)</small>
                  <span className="fw-bold text-gold-accent fs-5">${montoFin.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListaVentas;
