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
  pago TEXT NOT NULL
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

-- DATOS INICIALES: VENDEDORES
INSERT INTO public.vendedores (id, usuario, password, email, nombres, rol, sexo, edad, telefono, estado, fotografia) VALUES
('1', 'Marquina2014', '123456', 'Luiseduardo15097@gmail.com', 'luis marquina', 'administrador', 'masculino', 30, '04127153847', true, ''),
('2', 'Sofiapatas', '123456', 'Sofiamarcano1@gmail.com', 'Sofia marcano', 'barbero', 'femenino', 24, '04241290567', true, ''),
('3', 'MatiasFade', '123456', 'matias.valderrama@legendario.com', 'Matías Valderrama', 'barbero', 'masculino', 27, '04148392015', true, ''),
('4', 'GaelBlade', '123456', 'gael.montenegro@legendario.com', 'Gael Montenegro', 'barbero', 'masculino', 29, '04129546182', true, '')
ON CONFLICT (id) DO NOTHING;

-- DATOS INICIALES: CLIENTES
INSERT INTO public.clientes (id, nombres, telefono, visitas, ultimo, estado) VALUES
('1', 'Gabriel Torres', '+58 412 8889900', 12, 'Combo Legendario', true),
('2', 'José Manuel Díaz', '+58 414 7776655', 5, 'Corte Clásico', true),
('3', 'Ricardo Peña', '+58 424 1112233', 8, 'Combo Legendario', true),
('4', 'Sebastián Aristizábal', '+58 412 3049182', 15, 'Combo Legendario', true),
('5', 'Maximiliano Urdaneta', '+58 414 6291045', 9, 'Corte Clásico', true),
('6', 'Leonardo Santamaría', '+58 424 8173640', 19, 'Perfilado de Barba', true),
('7', 'Cristóbal Villamizar', '+58 412 5902831', 6, 'Tratamiento Capilar', true),
('8', 'Braulio Betancourt', '+58 416 7419023', 11, 'Combo Legendario', true),
('9', 'Damián Reverón', '+58 424 3384910', 4, 'Corte Clásico', true),
('10', 'Ignacio Salvatierra', '+58 414 9027461', 14, 'Combo Legendario', true),
('11', 'Thiago Altamirano', '+58 412 7751938', 7, 'Perfilado de Barba', true),
('12', 'Esteban Pietri', '+58 424 5168209', 3, 'Corte Clásico', false),
('13', 'Octavio Bustamante', '+58 414 2984517', 21, 'Tratamiento Capilar', true)
ON CONFLICT (id) DO NOTHING;

-- DATOS INICIALES: FÓRMULA INICIAL
INSERT INTO public.formulas (id, nombre, descripcion, tipo, "porcentajeCorte", "porcentajeReduccion", pasos, "fechaCreacion", principal, estado) VALUES
('#F-01', 'Fórmula Inicial', '18% del corte, menos la mitad', 'descuento_y_mitad', 18, 50, 2, '2026-10-12', true, true)
ON CONFLICT (id) DO NOTHING;

-- DATOS INICIALES: VENTAS
INSERT INTO public.ventas (id, "fechaHora", "fechaISO", vendedor, cliente, servicio, "formulaAplicada", monto, "montoFinal", pago) VALUES
('#V-222', 'Hoy 19:20', '2026-10-12', 'luis marquina', 'Sebastián Aristizábal', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Zelle'),
('#V-221', 'Hoy 18:10', '2026-10-12', 'Matías Valderrama', 'Leonardo Santamaría', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Pago Móvil'),
('#V-220', 'Hoy 16:45', '2026-10-12', 'Sofia marcano', 'Maximiliano Urdaneta', 'Tratamiento Capilar', 'Fórmula Inicial', 18.00, 7.38, 'Tarjeta'),
('#V-219', 'Hoy 15:30', '2026-10-12', 'Gael Montenegro', 'Octavio Bustamante', 'Perfilado de Barba', 'Fórmula Inicial', 10.00, 4.10, 'Efectivo'),
('#V-218', 'Ayer 19:45', '2026-10-11', 'luis marquina', 'Gabriel Torres', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Zelle'),
('#V-217', 'Ayer 18:50', '2026-10-11', 'Sofia marcano', 'José Manuel Díaz', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Efectivo'),
('#V-216', 'Ayer 17:35', '2026-10-11', 'Matías Valderrama', 'Cristóbal Villamizar', 'Tratamiento Capilar', 'Fórmula Inicial', 18.00, 7.38, 'Pago Móvil'),
('#V-215', 'Ayer 16:20', '2026-10-11', 'Gael Montenegro', 'Braulio Betancourt', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Tarjeta'),
('#V-214', 'Ayer 15:10', '2026-10-11', 'luis marquina', 'Damián Reverón', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Efectivo'),
('#V-213', 'Ayer 14:05', '2026-10-11', 'Sofia marcano', 'Ignacio Salvatierra', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Zelle'),
('#V-212', 'Ayer 12:50', '2026-10-11', 'Matías Valderrama', 'Thiago Altamirano', 'Perfilado de Barba', 'Fórmula Inicial', 10.00, 4.10, 'Pago Móvil'),
('#V-211', 'Ayer 11:40', '2026-10-11', 'Gael Montenegro', 'Ricardo Peña', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Efectivo'),
('#V-210', 'Ayer 10:30', '2026-10-11', 'luis marquina', 'Esteban Pietri', 'Tratamiento Capilar', 'Fórmula Inicial', 18.00, 7.38, 'Tarjeta'),
('#V-209', 'Ayer 09:45', '2026-10-11', 'Matías Valderrama', 'Sebastián Aristizábal', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Zelle'),
('#V-208', '10/10/2026 19:15', '2026-10-10', 'Gael Montenegro', 'Octavio Bustamante', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Zelle'),
('#V-207', '10/10/2026 18:05', '2026-10-10', 'Sofia marcano', 'Leonardo Santamaría', 'Perfilado de Barba', 'Fórmula Inicial', 10.00, 4.10, 'Efectivo'),
('#V-206', '10/10/2026 16:50', '2026-10-10', 'luis marquina', 'Maximiliano Urdaneta', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Pago Móvil'),
('#V-205', '10/10/2026 15:40', '2026-10-10', 'Matías Valderrama', 'Ignacio Salvatierra', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Tarjeta'),
('#V-204', '10/10/2026 14:25', '2026-10-10', 'Gael Montenegro', 'Cristóbal Villamizar', 'Tratamiento Capilar', 'Fórmula Inicial', 18.00, 7.38, 'Zelle'),
('#V-203', '10/10/2026 13:10', '2026-10-10', 'Sofia marcano', 'Braulio Betancourt', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Efectivo'),
('#V-202', '10/10/2026 11:55', '2026-10-10', 'luis marquina', 'Thiago Altamirano', 'Perfilado de Barba', 'Fórmula Inicial', 10.00, 4.10, 'Pago Móvil'),
('#V-201', '10/10/2026 10:30', '2026-10-10', 'Matías Valderrama', 'Damián Reverón', 'Corte Clásico', 'Fórmula Inicial', 15.00, 6.15, 'Efectivo'),
('#V-200', '10/10/2026 09:45', '2026-10-10', 'Gael Montenegro', 'Gabriel Torres', 'Combo Legendario', 'Fórmula Inicial', 22.00, 9.02, 'Tarjeta'),
('#V-199', '10/10/2026 09:00', '2026-10-10', 'Sofia marcano', 'Ricardo Peña', 'Tratamiento Capilar', 'Fórmula Inicial', 18.00, 7.38, 'Zelle')
ON CONFLICT (id) DO NOTHING;
