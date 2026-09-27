import React from 'react';

/**
 * Componente: BrandLogo
 * Propósito: Muestra el logo oficial de "LEGENDARIO BARBER SHOP"
 * con el león estilizado, tipografía en blanco y toques dorados.
 * 
 * @param {Object} props
 * @param {string} [props.title="LEGENDARIO"] - Título de la barbería
 * @param {string} [props.subtitle="BARBER SHOP"] - Subtítulo descriptivo
 * @param {string} [props.size="normal"] - Tamaño del logo ('normal' | 'menu' | 'large')
 */
const BrandLogo = ({ title = 'LEGENDARIO', subtitle = 'BARBER SHOP', size = 'normal' }) => {
  // Ajustes proporcionales según el tamaño solicitado
  let imgHeight = '80px';
  let titleSize = '1.25rem';
  let subtitleSize = '0.72rem';

  if (size === 'menu') {
    imgHeight = '105px';    // Logo más grande para el menú lateral
    titleSize = '1.48rem';   // Letras del título visiblemente más grandes
    subtitleSize = '0.84rem'; // Subtítulo dorado proporcional
  } else if (size === 'large') {
    imgHeight = '135px';
    titleSize = '1.75rem';
    subtitleSize = '0.92rem';
  }

  return (
    <div className="d-flex flex-column align-items-center text-center">
      {/* Imagen del logo oficial del león Legendario */}
      <img
        src="/assets/legendario-logo.png"
        alt="Legendario Barber Shop"
        className="brand-logo-img mb-2"
        style={{
          maxHeight: imgHeight,
          width: 'auto',
          objectFit: 'contain'
        }}
      />

      {/* Contenedor tipográfico de la marca */}
      <div>
        <h3
          className="m-0 fw-extrabold text-white tracking-widest text-uppercase"
          style={{
            fontSize: titleSize,
            letterSpacing: '3px'
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <span
            className="text-gold-accent fw-bold text-uppercase d-block mt-1"
            style={{
              fontSize: subtitleSize,
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
