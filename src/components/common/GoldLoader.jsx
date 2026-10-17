import React from 'react';

/**
 * Componente: GoldLoader
 * Propósito: Loader temático dorado y negro para Legendario Barber Shop.
 * Soporta modo overlay (pantalla completa o sobre modal) y modo embebido.
 */
const GoldLoader = ({
  overlay = false,
  text = 'Procesando...',
  subtext = 'Por favor espere un momento',
  icon = 'bi-scissors'
}) => {
  const content = (
    <div className={overlay ? 'gold-loader-card' : 'd-flex flex-column align-items-center gap-2 p-3 text-center'}>
      <div className="gold-spinner-container">
        <div className="gold-spinner-outer"></div>
        <div className="gold-spinner-inner"></div>
        <i className={`bi ${icon} gold-spinner-icon`}></i>
      </div>
      {text && <h6 className="fw-bold text-white m-0 fs-6">{text}</h6>}
      {subtext && <small className="text-secondary-custom">{subtext}</small>}
    </div>
  );

  if (overlay) {
    return <div className="gold-loader-overlay">{content}</div>;
  }

  return content;
};

export default GoldLoader;
