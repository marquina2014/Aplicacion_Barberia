import seedData from '../../db.json';
import { supabase } from './supabaseClient';
import { leerLocal, escribirLocal, sbGet, sbUpsert } from './api';

// --- SERVICIOS APLICADOS ---
export const getServicios = async () => {
  const remotos = await sbGet('servicios', 'id', true);
  return remotos && remotos.length > 0 ? escribirLocal('servicios', remotos) : leerLocal('servicios');
};

export const saveServicio = async (formData, editingId = null) => {
  const listaActual = leerLocal('servicios');
  const id = editingId || `srv-${Date.now()}`;
  const payload = {
    ...formData,
    id: String(id),
    nombre: (formData.nombre || '').trim(),
    precio: Number(formData.precio) || 0,
    estado: typeof formData.estado === 'boolean' ? formData.estado : true
  };
  await sbUpsert('servicios', payload);
  const nueva = editingId
    ? listaActual.map((s) => (String(s.id) === String(id) ? payload : s))
    : [...listaActual, payload];
  escribirLocal('servicios', nueva);
  return nueva;
};

// --- MÉTODOS DE PAGO (DÓLARES Y BOLÍVARES) ---
export const getMetodosPago = async () => {
  const remotos = await sbGet('metodos_pago', 'id', true);
  return remotos && remotos.length > 0 ? escribirLocal('metodosPago', remotos) : leerLocal('metodosPago');
};

export const saveMetodoPago = async (formData, editingId = null) => {
  const listaActual = leerLocal('metodosPago');
  const id = editingId || `mp-${Date.now()}`;
  const payload = {
    ...formData,
    id: String(id),
    nombre: (formData.nombre || '').trim(),
    moneda: formData.moneda || 'Dólares',
    estado: typeof formData.estado === 'boolean' ? formData.estado : true
  };
  await sbUpsert('metodos_pago', payload);
  const nueva = editingId
    ? listaActual.map((m) => (String(m.id) === String(id) ? payload : m))
    : [...listaActual, payload];
  escribirLocal('metodosPago', nueva);
  return nueva;
};

// --- FÓRMULAS DE CÁLCULO ---
export const getFormulas = async () => {
  const remotos = await sbGet('formulas', 'id', true);
  return remotos && remotos.length > 0 ? escribirLocal('formulas', remotos) : leerLocal('formulas');
};

export const saveFormula = async (formData, editingId = null) => {
  const listaActual = leerLocal('formulas');
  const id = editingId || `#F-0${listaActual.length + 1}`;
  const payload = {
    ...formData,
    id: String(id),
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
