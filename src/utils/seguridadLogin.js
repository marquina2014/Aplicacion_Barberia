import { cifrarDatos, descifrarDatos } from './criptografia';

const STORAGE_KEY = 'legendario_sec_lockout';
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MS = 60 * 1000; // 60 segundos de bloqueo temporal

const leerEstado = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { intentos: 0, bloqueadoHasta: 0 };
    const descifrado = descifrarDatos(raw);
    return descifrado && typeof descifrado === 'object'
      ? descifrado
      : { intentos: 0, bloqueadoHasta: 0 };
  } catch (_) {
    return { intentos: 0, bloqueadoHasta: 0 };
  }
};

const guardarEstado = (estado) => {
  try {
    localStorage.setItem(STORAGE_KEY, cifrarDatos(estado));
  } catch (_) {}
};

/**
 * Verifica si el inicio de sesión está bloqueado por demasiados intentos fallidos (Anti-Brute Force).
 */
export const obtenerEstadoSeguridadLogin = () => {
  const estado = leerEstado();
  const ahora = Date.now();

  if (estado.bloqueadoHasta && estado.bloqueadoHasta > ahora) {
    const segundosRestantes = Math.ceil((estado.bloqueadoHasta - ahora) / 1000);
    return {
      bloqueado: true,
      segundosRestantes,
      intentosRestantes: 0,
      maxIntentos: MAX_INTENTOS
    };
  }

  // Si el bloqueo ya expiró, reseteamos el contador
  if (estado.bloqueadoHasta && estado.bloqueadoHasta <= ahora) {
    guardarEstado({ intentos: 0, bloqueadoHasta: 0 });
    return {
      bloqueado: false,
      segundosRestantes: 0,
      intentosRestantes: MAX_INTENTOS,
      maxIntentos: MAX_INTENTOS
    };
  }

  const intentosActuales = Number(estado.intentos) || 0;
  const intentosRestantes = Math.max(0, MAX_INTENTOS - intentosActuales);
  return {
    bloqueado: false,
    segundosRestantes: 0,
    intentosRestantes,
    maxIntentos: MAX_INTENTOS
  };
};

/**
 * Registra un intento fallido y activa el bloqueo si supera el umbral.
 */
export const registrarFalloLogin = () => {
  const estado = leerEstado();
  const nuevosIntentos = (Number(estado.intentos) || 0) + 1;
  const ahora = Date.now();

  if (nuevosIntentos >= MAX_INTENTOS) {
    const bloqueadoHasta = ahora + TIEMPO_BLOQUEO_MS;
    guardarEstado({ intentos: nuevosIntentos, bloqueadoHasta });
    return {
      bloqueado: true,
      segundosRestantes: Math.ceil(TIEMPO_BLOQUEO_MS / 1000),
      intentosRestantes: 0
    };
  }

  guardarEstado({ intentos: nuevosIntentos, bloqueadoHasta: 0 });
  return {
    bloqueado: false,
    segundosRestantes: 0,
    intentosRestantes: MAX_INTENTOS - nuevosIntentos
  };
};

/**
 * Restablece los contadores tras un inicio de sesión exitoso.
 */
export const resetearIntentosLogin = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
};
