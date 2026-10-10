/**
 * Sesión del usuario logueado (capa temporal).
 * Hoy devuelve un usuario de ejemplo; al integrar Supabase solo hay que
 * reemplazar el cuerpo de `obtenerUsuarioActual` (ver supabase.auth.getUser()
 * + consulta a la tabla `vendedores`) sin tocar los componentes.
 */
const USUARIO_DEMO = {
  nombre: 'Michael Rodríguez',
  rol: 'Administrador',
  fotoUrl: null // URL pública (o firmada) de Supabase Storage
};

/**
 * Retorna los datos del usuario con sesión activa.
 * @returns {{nombre: string, rol: string, fotoUrl: (string|null)}}
 */
export const obtenerUsuarioActual = () => USUARIO_DEMO;
