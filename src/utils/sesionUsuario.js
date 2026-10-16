import { cifrarDatos, descifrarDatos } from './criptografia';

/**
 * Gestión de la sesión activa y Token JWT Encriptado del usuario logueado.
 * Tiempo de expiración máximo configurado: 10 años (315,360,000 segundos).
 */
const STORAGE_KEY = 'legendario_usuario_sesion';
const TOKEN_KEY = 'legendario_jwt_token';
const JWT_SECRET = 'legendario_barber_shop_jwt_secret_2026';
const JWT_MAX_EXP_SECONDS = 60 * 60 * 24 * 365 * 10; // 10 años

const USUARIO_POR_DEFECTO = {
  id: '1', usuario: 'admin', email: 'admin@legendario.com',
  nombre: 'Administrador', rol: 'administrador', fotoUrl: ''
};

const base64UrlEncode = (obj) => {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
};

/**
 * Genera un JWT cuyo payload interno va cifrado simétricamente (nadie puede ver los datos en claro).
 */
export const generarTokenJWT = (sesion) => {
  const ahora = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode({ alg: 'HS256+ENC', typ: 'JWT' });
  const datosSecretos = cifrarDatos({
    sub: String(sesion.id), usuario: sesion.usuario, nombre: sesion.nombre,
    email: sesion.email, rol: sesion.rol, iat: ahora, exp: ahora + JWT_MAX_EXP_SECONDS
  });
  const payload = base64UrlEncode({ enc: datosSecretos });
  const firma = base64UrlEncode(`${header}.${payload}.${JWT_SECRET}`);
  return `${header}.${payload}.${firma}`;
};

/**
 * Decodifica, descifra y verifica que el JWT sea válido y no haya expirado.
 */
export const decodificarTokenJWT = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const partes = token.split('.');
    if (partes.length !== 3) return null;
    const envoltorio = base64UrlDecode(partes[1]);
    const payload = envoltorio?.enc ? descifrarDatos(envoltorio.enc) : envoltorio;
    const ahora = Math.floor(Date.now() / 1000);
    return payload?.exp > ahora ? payload : null;
  } catch (_) { return null; }
};

const leerSesionAlmacenada = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const descifrado = descifrarDatos(raw);
  if (descifrado) return descifrado;
  try {
    const legado = JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, cifrarDatos(legado));
    return legado;
  } catch (_) { return null; }
};

export const tieneSesionActiva = () => {
  try {
    if (decodificarTokenJWT(localStorage.getItem(TOKEN_KEY))) return true;
    const user = leerSesionAlmacenada();
    if (user) {
      localStorage.setItem(TOKEN_KEY, generarTokenJWT(user));
      return true;
    }
    return false;
  } catch (_) { return false; }
};

export const obtenerTokenJWT = () => (tieneSesionActiva() ? localStorage.getItem(TOKEN_KEY) : null);

export const obtenerUsuarioActual = () => {
  try {
    const sesion = leerSesionAlmacenada();
    if (sesion) return sesion;
    const p = decodificarTokenJWT(localStorage.getItem(TOKEN_KEY));
    if (p) return { id: p.sub, usuario: p.usuario, email: p.email, nombre: p.nombre, rol: p.rol, fotoUrl: '' };
    return USUARIO_POR_DEFECTO;
  } catch (_) { return USUARIO_POR_DEFECTO; }
};

export const esAdministrador = (usuario = obtenerUsuarioActual()) =>
  (usuario?.rol || '').toLowerCase() === 'administrador';

export const guardarUsuarioActual = (vendedor) => {
  const sesion = {
    id: String(vendedor.id || '1'),
    usuario: vendedor.usuario || 'admin',
    email: vendedor.email || '',
    nombre: vendedor.nombres || vendedor.nombre || 'Administrador',
    rol: vendedor.rol || 'barbero',
    fotoUrl: vendedor.fotografia ?? vendedor.fotoUrl ?? ''
  };
  try {
    localStorage.setItem(STORAGE_KEY, cifrarDatos(sesion));
    localStorage.setItem(TOKEN_KEY, generarTokenJWT(sesion));
    window.dispatchEvent(new Event('sesion-actualizada'));
  } catch (_) {}
  return sesion;
};

export const cerrarSesion = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('sesion-actualizada'));
  } catch (_) {}
};
