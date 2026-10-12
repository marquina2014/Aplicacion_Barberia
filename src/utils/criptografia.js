/**
 * Utilidad de Cifrado Simétrico (Stream Cipher + Salt Aleatorio + Firma de Integridad)
 * Protege el payload del JWT y los datos de sesión en localStorage para que no sean
 * legibles en texto plano ni decodificables mediante Base64 estándar.
 */
const CLAVE_MAESTRA = 'L3g3nd4r10_B4rb3r_Sh0p_K3y_2026!#99';

const aBase64Url = (bytes) => {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const deBase64Url = (str) => {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

/**
 * Genera el flujo de llave pseudoaleatorio (PRGA / KSA) derivado de la clave maestra y el IV.
 */
const generarKeystream = (semilla, longitud) => {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) s[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + semilla.charCodeAt(i % semilla.length)) & 0xff;
    const tmp = s[i]; s[i] = s[j]; s[j] = tmp;
  }
  const out = new Uint8Array(longitud);
  let x = 0, y = 0;
  for (let k = 0; k < longitud; k++) {
    x = (x + 1) & 0xff;
    y = (y + s[x]) & 0xff;
    const tmp = s[x]; s[x] = s[y]; s[y] = tmp;
    out[k] = s[(s[x] + s[y]) & 0xff];
  }
  return out;
};

const firmaCortas = (texto) => {
  let h1 = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h1 ^= texto.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  return h1.toString(16).padStart(8, '0');
};

/**
 * Cifra cualquier objeto o cadena devolviendo un bloque opaco `iv.ciphertext.mac`.
 */
export const cifrarDatos = (datos) => {
  const json = typeof datos === 'string' ? datos : JSON.stringify(datos);
  const bytesTexto = new TextEncoder().encode(json);
  const ivBytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(ivBytes);
  } else {
    for (let i = 0; i < 8; i++) ivBytes[i] = Math.floor(Math.random() * 256);
  }
  const ivHex = Array.from(ivBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  const keystream = generarKeystream(`${CLAVE_MAESTRA}:${ivHex}`, bytesTexto.length);
  const cifrado = new Uint8Array(bytesTexto.length);
  for (let i = 0; i < bytesTexto.length; i++) {
    cifrado[i] = bytesTexto[i] ^ keystream[i];
  }
  const cuerpo = aBase64Url(cifrado);
  const mac = firmaCortas(`${ivHex}.${cuerpo}.${CLAVE_MAESTRA}`);
  return `${ivHex}.${cuerpo}.${mac}`;
};

/**
 * Descifra y verifica la autenticidad de un bloque cifrado con `cifrarDatos`.
 */
export const descifrarDatos = (bloqueCifrado) => {
  try {
    if (!bloqueCifrado || typeof bloqueCifrado !== 'string') return null;
    const partes = bloqueCifrado.split('.');
    if (partes.length !== 3) return null;
    const [ivHex, cuerpo, mac] = partes;
    const macEsperado = firmaCortas(`${ivHex}.${cuerpo}.${CLAVE_MAESTRA}`);
    if (mac !== macEsperado) return null;
    const cifrado = deBase64Url(cuerpo);
    const keystream = generarKeystream(`${CLAVE_MAESTRA}:${ivHex}`, cifrado.length);
    const plano = new Uint8Array(cifrado.length);
    for (let i = 0; i < cifrado.length; i++) {
      plano[i] = cifrado[i] ^ keystream[i];
    }
    const json = new TextDecoder().decode(plano);
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
};
