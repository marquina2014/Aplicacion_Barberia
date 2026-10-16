import { supabase } from './supabaseClient';
import { leerLocal } from './api';

export const COLS_PUBLICAS_VENDEDORES = 'id, usuario, email, nombres, rol, sexo, edad, telefono, estado, fotografia';

/**
 * Autenticación segura de usuario:
 * - NO expone listas de usuarios en la red.
 * - NO devuelve el campo password en la respuesta de Supabase ni en memoria.
 * - Si las credenciales fallan, devuelve error sin filtrar información de otros usuarios.
 */
export const loginUsuario = async (identificador, passwordPlano) => {
  const userKey = (identificador || '').trim();
  const passKey = String(passwordPlano || '');
  if (!userKey || !passKey) return { ok: false, error: 'Usuario y contraseña requeridos' };

  if (supabase) {
    try {
      // 1. RPC seguro en Supabase si está creado
      const { data: rpcData, error: rpcErr } = await supabase.rpc('autenticar_barbero', {
        p_identificador: userKey, p_password: passKey
      });
      if (!rpcErr && Array.isArray(rpcData)) {
        if (rpcData.length > 0) {
          const u = rpcData[0];
          if (u.estado === false) return { ok: false, error: 'Este usuario se encuentra inactivo' };
          return { ok: true, usuario: u };
        }
        return { ok: false, error: 'Usuario o contraseña incorrectos' };
      }

      // 2. Consulta filtrada directamente por usuario Y contraseña (respuesta vacía si falla)
      const clean = userKey.replace(/[^a-zA-Z0-9@._-]/g, '');
      const { data, error } = await supabase
        .from('vendedores')
        .select(COLS_PUBLICAS_VENDEDORES)
        .or(`usuario.ilike.${clean},email.ilike.${clean}`)
        .eq('password', passKey)
        .maybeSingle();

      if (!error) {
        if (!data) return { ok: false, error: 'Usuario o contraseña incorrectos' };
        if (data.estado === false) return { ok: false, error: 'Este usuario se encuentra inactivo' };
        return { ok: true, usuario: data };
      }
    } catch (_) {}
  }

  // 3. Fallback offline con seed local cifrado
  const locales = leerLocal('vendedores');
  const match = locales.find(
    (v) => ((v.usuario || '').toLowerCase() === userKey.toLowerCase() ||
            (v.email || '').toLowerCase() === userKey.toLowerCase()) &&
           String(v.password || '') === passKey
  );
  if (!match) return { ok: false, error: 'Usuario o contraseña incorrectos' };
  if (match.estado === false) return { ok: false, error: 'Este usuario se encuentra inactivo' };
  const { password, ...seguro } = match;
  return { ok: true, usuario: seguro };
};
