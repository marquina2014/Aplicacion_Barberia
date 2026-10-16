-- ====================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE - LEGENDARIO BARBER SHOP
-- Pega este script en Supabase -> SQL Editor y presiona "Run".
-- ====================================================================

-- 1. TABLA: VENDEDORES (BARBEROS Y ADMINISTRADORES)
CREATE TABLE IF NOT EXISTS public.vendedores (
  id TEXT PRIMARY KEY,
  usuario TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  nombres TEXT NOT NULL,
  rol TEXT DEFAULT 'barbero',
  sexo TEXT DEFAULT 'masculino',
  edad INT DEFAULT 25,
  telefono TEXT,
  estado BOOLEAN DEFAULT true,
  fotografia TEXT DEFAULT ''
);

-- 2. TABLA: CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
  id TEXT PRIMARY KEY,
  nombres TEXT NOT NULL,
  telefono TEXT,
  visitas INT DEFAULT 1,
  ultimo TEXT DEFAULT 'Corte Clásico',
  estado BOOLEAN DEFAULT true
);

-- 3. TABLA: VENTAS
CREATE TABLE IF NOT EXISTS public.ventas (
  id TEXT PRIMARY KEY,
  "fechaHora" TEXT,
  "fechaISO" TEXT,
  vendedor TEXT NOT NULL,
  cliente TEXT NOT NULL,
  servicio TEXT NOT NULL,
  "formulaAplicada" TEXT DEFAULT 'Fórmula Inicial',
  monto NUMERIC(10,2) NOT NULL,
  "montoFinal" NUMERIC(10,2) NOT NULL,
  pago TEXT NOT NULL,
  "referenciaPago" TEXT DEFAULT ''
);

-- 4. TABLA: FÓRMULAS
CREATE TABLE IF NOT EXISTS public.formulas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT DEFAULT 'descuento_y_mitad',
  "porcentajeCorte" NUMERIC(5,2) DEFAULT 18,
  "porcentajeReduccion" NUMERIC(5,2) DEFAULT 50,
  pasos INT DEFAULT 2,
  "fechaCreacion" TEXT,
  principal BOOLEAN DEFAULT false,
  estado BOOLEAN DEFAULT true
);

-- Deshabilitar RLS para acceso API directo
ALTER TABLE public.vendedores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.formulas DISABLE ROW LEVEL SECURITY;

-- DATOS INICIALES: ADMINISTRADOR PRINCIPAL
INSERT INTO public.vendedores (id, usuario, password, email, nombres, rol, sexo, edad, telefono, estado, fotografia) VALUES
('1', 'Marquina2014', '123456', 'Luiseduardo15097@gmail.com', 'luis marquina', 'administrador', 'masculino', 30, '04127153847', true, '')
ON CONFLICT (id) DO NOTHING;

-- DATOS INICIALES: FÓRMULA INICIAL (ACTIVA)
INSERT INTO public.formulas (id, nombre, descripcion, tipo, "porcentajeCorte", "porcentajeReduccion", pasos, "fechaCreacion", principal, estado) VALUES
('#F-01', 'Fórmula Inicial', '18% del corte, menos la mitad', 'descuento_y_mitad', 18, 50, 2, '2026-10-12', true, true)
ON CONFLICT (id) DO NOTHING;

