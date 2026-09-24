import React from 'react';

/**
 * Componente: BrandLogo
 * Propósito: Muestra el logo oficial de "LEGENDARIO BARBER SHOP"
 * con el león estilizado, tipografía en blanco y toques dorados.
 * 
 * @param {Object} props
 * @param {string} [props.title="LEGENDARIO"] - Título de la barbería
 * @param {string} [props.subtitle="BARBER SHOP"] - Subtítulo descriptivo
 * @param {string} [props.size="normal"] - Tamaño del logo ('normal' | 'large')
 */
const BrandLogo = ({ title = 'LEGENDARIO', subtitle = 'BARBER SHOP', size = 'normal' }) => {
  const isLarge = size === 'large';

  return (
    <div className="d-flex flex-column align-items-center text-center">
      {/* Imagen del logo oficial Legendario */}
      <img
        src="/assets/legendario-logo.png"
        alt="Legendario Barber Shop"
        className="brand-logo-img mb-2"
        style={{
          maxHeight: isLarge ? '110px' : '65px',
          width: 'auto'
        }}
      />

      {/* Textos de la marca */}
      <div>
        <h3
          className="m-0 fw-extrabold text-white tracking-widest text-uppercase"
          style={{
            fontSize: isLarge ? '1.5rem' : '1.15rem',
            letterSpacing: '3px'
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <span
            className="text-gold-accent fw-bold text-uppercase d-block"
            style={{
              fontSize: isLarge ? '0.8rem' : '0.65rem',
              letterSpacing: '4px'
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
