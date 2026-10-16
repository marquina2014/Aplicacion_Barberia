import seedData from '../../db.json';
import { supabase } from './supabaseClient';
import { obtenerUsuarioActual, guardarUsuarioActual } from '../utils/sesionUsuario';
import { cifrarDatos, descifrarDatos } from '../utils/criptografia';

const leerLocal = (tabla) => {
  const base = seedData[tabla] || [];
  try {
    const raw = localStorage.getItem(`legendario_db_v3_${tabla}`);
    if (raw) {
      const guardado = descifrarDatos(raw) || JSON.parse(raw);
      if (Array.isArray(guardado)) {
        const ids = new Set(guardado.map((x) => String(x.id)));
        return [...guardado, ...base.filter((x) => !ids.has(String(x.id)))];
      }
    }
  } catch (_) {}
  return base;
};

const escribirLocal = (tabla, lista) => {
  try { localStorage.setItem(`legendario_db_v3_${tabla}`, cifrarDatos(lista)); } catch (_) {}
  return lista;
};

const sbGet = async (tabla, order = 'id', asc = true) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(tabla).select('*').order(order, { ascending: asc });
    return !error && data ? data : null;
  } catch (_) { return null; }
};

const sbUpsert = async (tabla, item) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(tabla).upsert(item).select().single();
    if (error && tabla === 'ventas' && error.message?.includes('referenciaPago')) {
      const { referenciaPago, ...sinRef } = item;
      const res = await supabase.from(tabla).upsert(sinRef).select().single();
      return !res.error && res.data ? { ...res.data, referenciaPago } : null;
    }
    if (error && tabla === 'clientes' && error.message?.includes('cedula')) {
      const { cedula, ...sinCed } = item;
      const res = await supabase.from(tabla).upsert(sinCed).select().single();
      return !res.error && res.data ? { ...res.data, cedula } : null;
    }
    return !error && data ? data : null;
  } catch (_) { return null; }
};

// --- VENDEDORES ---
export const getVendedores = async () => {
  const remotos = await sbGet('vendedores', 'id', true);
  return remotos && remotos.length > 0 ? escribirLocal('vendedores', remotos) : leerLocal('vendedores');
};

export const saveVendedor = async (formData, editingId = null) => {
  const actual = obtenerUsuarioActual();
  const payload = {
    ...formData, edad: Number(formData.edad) || 0,
    rol: formData.rol || (String(editingId) === '1' ? 'administrador' : 'barbero'),
    estado: typeof formData.estado === 'boolean' ? formData.estado : true,
    fotografia: formData.fotografia || ''
  };
  const item = { ...payload, id: String(editingId || Date.now()) };
  const guardado = await sbUpsert('vendedores', item);
  const lista = leerLocal('vendedores');
  const nueva = editingId ? lista.map((v) => (String(v.id) === String(editingId) ? (guardado || item) : v)) : [...lista, (guardado || item)];
  escribirLocal('vendedores', nueva);
  if (String(item.id) === String(actual.id)) guardarUsuarioActual(guardado || item);
  return guardado || item;
};

// --- CLIENTES ---
export const getClientes = async () => {
  const remotos = await sbGet('clientes', 'id', true);
  return remotos ? escribirLocal('clientes', remotos) : leerLocal('clientes');
};

export const saveCliente = async (formData, editingId = null) => {
  const payload = { ...formData, cedula: formData.cedula?.trim() || '', visitas: formData.visitas ?? 1, ultimo: formData.ultimo || 'Nuevo Registro', estado: typeof formData.estado === 'boolean' ? formData.estado : true };
  const item = { ...payload, id: String(editingId || Date.now()) };
  const guardado = await sbUpsert('clientes', item);
  const lista = leerLocal('clientes');
  const nueva = editingId ? lista.map((c) => (String(c.id) === String(editingId) ? (guardado || item) : c)) : [guardado || item, ...lista];
  escribirLocal('clientes', nueva);
  return guardado || item;
};

export const createCliente = (nuevo) => saveCliente(nuevo, null);

export const syncClienteDesdeVenta = async (nombre, cedula = '', telefono = '', servicio = '') => {
  if (!nombre?.trim()) return null;
  const nNorm = nombre.trim().toLowerCase();
  const cNorm = cedula?.trim().toLowerCase();
  const existente = (await getClientes()).find((c) => (cNorm && (c.cedula || '').trim().toLowerCase() === cNorm) || (c.nombres || '').trim().toLowerCase() === nNorm);
  if (existente) {
    return saveCliente({
      ...existente, cedula: cedula?.trim() || existente.cedula || '',
      visitas: (Number(existente.visitas) || 1) + 1,
      ultimo: servicio || existente.ultimo, telefono: telefono?.trim() || existente.telefono || ''
    }, existente.id);
  }
  return createCliente({ nombres: nombre.trim(), cedula: cedula?.trim() || '', telefono: telefono?.trim() || '', visitas: 1, ultimo: servicio || 'Corte Clásico', estado: true });
};

// --- VENTAS ---
export const getVentas = async () => {
  const remotos = await sbGet('ventas', 'fechaISO', false);
  return remotos && remotos.length > 0 ? escribirLocal('ventas', remotos) : leerLocal('ventas');
};

export const createVenta = async (venta) => {
  const guardado = await sbUpsert('ventas', venta);
  const lista = [guardado || venta, ...leerLocal('ventas')];
  escribirLocal('ventas', lista);
  return guardado || venta;
};

// --- FÓRMULAS ---
export const getFormulas = async () => {
  const remotos = await sbGet('formulas', 'id', true);
  return remotos && remotos.length > 0 ? escribirLocal('formulas', remotos) : leerLocal('formulas');
};

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
  if (supabase && payload.principal) {
    try { await supabase.from('formulas').update({ principal: false }).neq('id', id); } catch (_) {}
  }
  await sbUpsert('formulas', payload);
  const base = payload.principal ? listaActual.map((f) => ({ ...f, principal: false })) : listaActual;
  const nueva = editingId ? base.map((f) => (String(f.id) === String(id) ? payload : f)) : [...base, payload];
  escribirLocal('formulas', nueva);
  return nueva;
};
