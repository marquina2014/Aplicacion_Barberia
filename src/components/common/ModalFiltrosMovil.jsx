import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Componente: ModalFiltrosMovil
 * Propósito: Menú emergente de filtros avanzados para dispositivos móviles (< 992px).
 * Evita saturar la pantalla principal del celular manteniendo solo 2 filtros visibles afuera.
 */
const ModalFiltrosMovil = ({ show, onHide, onReset, activeCount = 0, children }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      enforceFocus={false}
      contentClassName="dark-card"
    >
      <Modal.Header closeButton closeVariant="white" className="border-gold">
        <Modal.Title className="text-white fw-bold fs-6 d-flex align-items-center gap-2">
          <i className="bi bi-sliders text-gold-accent"></i>
          <span>Más Filtros</span>
          {activeCount > 0 && (
            <span className="badge-pill-custom py-0 px-2 small">{activeCount}</span>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3">
        <div className="mobile-filters-modal-grid">
          {children}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-gold">
        <Button
          variant="outline-danger"
          className="modal-footer-btn"
          onClick={onReset}
        >
          <i className="bi bi-trash3-fill me-2"></i>Limpiar
        </Button>
        <Button
          className="btn-primary-gradient modal-footer-btn"
          onClick={onHide}
        >
          <i className="bi bi-check2-circle me-2"></i>Aplicar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalFiltrosMovil;
