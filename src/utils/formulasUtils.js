/**
 * Utilidades de cálculo para las Fórmulas de comisión / monto final del barbero.
 * Fórmula inicial por defecto: 18% del corte, menos la mitad (2 pasos).
 */

export const FORMULA_INICIAL = {
  id: '#F-01',
  nombre: 'Fórmula Inicial',
  descripcion: '18% del corte, menos la mitad',
  tipo: 'descuento_y_mitad',
  porcentajeCorte: 18,
  porcentajeReduccion: 50,
  pasos: 2,
  fechaCreacion: '2026-10-12',
  principal: true,
  estado: true
};

export const TIPOS_FORMULA = [
  {
    value: 'descuento_y_mitad',
    label: 'Descontar % del corte, menos la mitad'
  },
  {
    value: 'porcentaje_menos_mitad',
    label: 'Tomar % del corte, menos la mitad'
  },
  {
    value: 'mitad_menos_porcentaje',
    label: 'Mitad del corte menos % del corte'
  },
  {
    value: 'porcentaje_directo',
    label: 'Porcentaje directo del corte'
  }
];

/**
 * Obtiene la fórmula activa principal de la lista (o la fórmula inicial por defecto).
 */
export const obtenerFormulaActiva = (formulas = []) => {
  if (!Array.isArray(formulas) || formulas.length === 0) return FORMULA_INICIAL;
  return (
    formulas.find((f) => f.estado !== false && f.principal) ||
    formulas.find((f) => f.estado !== false) ||
    FORMULA_INICIAL
  );
};

/**
 * Calcula el Monto Final que queda al barbero a partir del Monto Original y la fórmula.
 */
export const calcularMontoFinal = (montoOriginal, formula = FORMULA_INICIAL) => {
  const base = Number(montoOriginal || 0);
  if (base <= 0) return 0;

  const f = formula || FORMULA_INICIAL;
  const pCorte = Number(f.porcentajeCorte ?? 18);
  const pRed = Number(f.porcentajeReduccion ?? 50);

  switch (f.tipo) {
    case 'porcentaje_menos_mitad': {
      const porcion = base * (pCorte / 100);
      return Number((porcion * (1 - pRed / 100)).toFixed(2));
    }
    case 'mitad_menos_porcentaje': {
      const mitad = base * (1 - pRed / 100);
      const descuento = base * (pCorte / 100);
      return Number(Math.max(0, mitad - descuento).toFixed(2));
    }
    case 'porcentaje_directo': {
      return Number((base * (pCorte / 100)).toFixed(2));
    }
    case 'descuento_y_mitad':
    default: {
      const trasDescuento = base * (1 - pCorte / 100);
      return Number((trasDescuento * (1 - pRed / 100)).toFixed(2));
    }
  }
};
