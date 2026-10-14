import seedData from '../../db.json';
import { obtenerUsuarioActual, guardarUsuarioActual, obtenerTokenJWT } from '../utils/sesionUsuario';
import { cifrarDatos, descifrarDatos } from '../utils/criptografia';

/**
 * Servicio centralizado de datos conectado a JSON Server (http://localhost:4000).
 * Envía el token JWT encriptado en Authorization y cifra el respaldo en localStorage.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getHeaders = (json = false) => {
  const token = obtenerTokenJWT();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return json ? { ...headers, 'Content-Type': 'application/json' } : headers;
};

const leerLocal = (tabla) => {
  const base = seedData[tabla] || [];
  try {
    const raw = localStorage.getItem(`legendario_db_v3_${tabla}`);
    if (raw) {
      const guardado = descifrarDatos(raw) || JSON.parse(raw);
      if (Array.isArray(guardado)) {
        const idsGuardados = new Set(guardado.map((x) => String(x.id)));
        const faltantes = base.filter((x) => !idsGuardados.has(String(x.id)));
        return [...guardado, ...faltantes];
      }
    }
  } catch (_) {}
  return base;
};

const escribirLocal = (tabla, lista) => {
  try {
    localStorage.setItem(`legendario_db_v3_${tabla}`, cifrarDatos(lista));
  } catch (_) {}
  return lista;
};

const fetchTabla = async (tabla) => {
  try {
    const res = await fetch(`${API_URL}/${tabla}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error HTTP');
    const data = await res.json();
    return escribirLocal(tabla, data);
  } catch (_) {
    return leerLocal(tabla);
  }
};

// --- VENDEDORES ---
export const getVendedores = () => fetchTabla('vendedores');

export const saveVendedor = async (formData, editingId = null) => {
  const actual = obtenerUsuarioActual();
  const payload = {
    ...formData,
    edad: Number(formData.edad) || 0,
    rol: formData.rol || (String(editingId) === '1' ? 'administrador' : 'barbero'),
    estado: typeof formData.estado === 'boolean' ? formData.estado : true,
    fotografia: formData.fotografia || ''
  };
  try {
    const url = editingId ? `${API_URL}/vendedores/${editingId}` : `${API_URL}/vendedores`;
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: String(editingId), ...payload } : { id: String(Date.now()), ...payload };
    const res = await fetch(url, { method, headers: getHeaders(true), body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Error HTTP');
    const saved = await res.json();
    if (String(saved.id) === String(actual.id)) guardarUsuarioActual(saved);
    return saved;
  } catch (_) {
    const lista = leerLocal('vendedores');
    const item = editingId ? { ...payload, id: String(editingId) } : { ...payload, id: String(Date.now()) };
    const nueva = editingId ? lista.map((v) => (String(v.id) === String(editingId) ? item : v)) : [...lista, item];
    escribirLocal('vendedores', nueva);
    if (String(item.id) === String(actual.id)) guardarUsuarioActual(item);
    return item;
  }
};

// --- CLIENTES ---
export const getClientes = () => fetchTabla('clientes');

export const saveCliente = async (formData, editingId = null) => {
  const payload = {
    ...formData,
    visitas: formData.visitas ?? 1,
    ultimo: formData.ultimo || 'Nuevo Registro',
    estado: typeof formData.estado === 'boolean' ? formData.estado : true
  };
  try {
    const url = editingId ? `${API_URL}/clientes/${editingId}` : `${API_URL}/clientes`;
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: String(editingId), ...payload } : { id: String(Date.now()), ...payload };
    const res = await fetch(url, { method, headers: getHeaders(true), body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Error HTTP');
    return await res.json();
  } catch (_) {
    const lista = leerLocal('clientes');
    const item = editingId ? { ...payload, id: String(editingId) } : { ...payload, id: String(Date.now()) };
    const nueva = editingId ? lista.map((c) => (String(c.id) === String(editingId) ? item : c)) : [item, ...lista];
    escribirLocal('clientes', nueva);
    return item;
  }
};

export const createCliente = (nuevo) => saveCliente(nuevo, null);

// --- VENTAS ---
export const getVentas = () => fetchTabla('ventas');

export const createVenta = async (venta) => {
  try {
    const res = await fetch(`${API_URL}/ventas`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(venta) });
    if (!res.ok) throw new Error('Error HTTP');
    return await res.json();
  } catch (_) {
    const lista = [venta, ...leerLocal('ventas')];
    escribirLocal('ventas', lista);
    return venta;
  }
};

// --- FÓRMULAS ---
export const getFormulas = () => fetchTabla('formulas');

export const saveFormula = async (formData, editingId = null) => {
  const listaActual = leerLocal('formulas');
  const id = editingId || `#F-0${listaActual.length + 1}`;
  const payload = {
    ...formData, id: String(id),
    porcentajeCorte: Number(formData.porcentajeCorte ?? 18),
    porcentajeReduccion: Number(formData.porcentajeReduccion ?? 50),
    pasos: Number(formData.pasos || 2),
    fechaCreacion: formData.fechaCreacion || new Date().toISOString().slice(0, 10),
    principal: Boolean(formData.principal),
    estado: typeof formData.estado === 'boolean' ? formData.estado : true
  };
  const base = payload.principal ? listaActual.map((f) => ({ ...f, principal: false })) : listaActual;
  const nueva = editingId ? base.map((f) => (String(f.id) === String(id) ? payload : f)) : [...base, payload];
  escribirLocal('formulas', nueva);
  try {
    const url = editingId ? `${API_URL}/formulas/${encodeURIComponent(id)}` : `${API_URL}/formulas`;
    await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: getHeaders(true), body: JSON.stringify(payload) });
  } catch (_) {}
  return nueva;
};
