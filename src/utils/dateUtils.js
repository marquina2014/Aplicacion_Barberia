/**
 * Utilidades para manejo de fechas locales (Formato YYYY-MM-DD y visualización).
 * Evita desajustes por zona horaria UTC en inputs de tipo date y filtros.
 */

const pad = (n) => String(n).padStart(2, '0');

/**
 * Obtiene la fecha local en formato estándar YYYY-MM-DD para <input type="date">.
 * @param {Date} [d=new Date()]
 * @returns {string} Formato YYYY-MM-DD
 */
export const getLocalDateISO = (d = new Date()) => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Retorna la fecha ISO (YYYY-MM-DD) relativa al día actual (hoy + offsetDays).
 * @param {number} offsetDays - Días a sumar o restar (ej: -1 para ayer)
 * @returns {string} Formato YYYY-MM-DD
 */
export const getRelativeDateISO = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return getLocalDateISO(d);
};

/**
 * Formatea una fecha relativa con hora (ej: "Hoy 18:40" o "24/09/2026 14:20").
 * @param {number} offsetDays
 * @param {string} timeStr - Hora en formato HH:mm
 * @returns {string}
 */
export const formatRelativeFechaHora = (offsetDays, timeStr) => {
  if (offsetDays === 0) return `Hoy ${timeStr}`;
  if (offsetDays === -1) return `Ayer ${timeStr}`;
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${timeStr}`;
};
