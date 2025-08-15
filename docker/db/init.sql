-- Tabla de rutas
CREATE TABLE IF NOT EXISTS rutas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    buses_disponibles INT NOT NULL DEFAULT 4,
    descripcion TEXT,
    activa BOOLEAN NOT NULL DEFAULT true
);

-- Tabla de frecuencias (horas de salida)
CREATE TABLE IF NOT EXISTS frecuencias (
    id SERIAL PRIMARY KEY,
    ruta_id INT NOT NULL REFERENCES rutas(id) ON DELETE CASCADE,
    hora_salida TIME NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(ruta_id, hora_salida)
);

-- Tabla de buses
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    ruta_id INT NOT NULL REFERENCES rutas(id) ON DELETE CASCADE,
    numero_bus VARCHAR(20) NOT NULL,
    capacidad INT NOT NULL DEFAULT 40,
    modelo VARCHAR(50),
    placa VARCHAR(20) UNIQUE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(ruta_id, numero_bus)
);

-- Tabla de asientos (estructura corregida)
CREATE TABLE IF NOT EXISTS asientos (
    id SERIAL PRIMARY KEY,
    bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    numero_asiento INT NOT NULL,
    fila INT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('normal', 'premium', 'discapacidad')),
    ubicacion VARCHAR(20) NOT NULL CHECK (ubicacion IN ('ventana_izq', 'ventana_der', 'pasillo_izq', 'pasillo_der')),
    ocupado BOOLEAN NOT NULL DEFAULT false,
    precio DECIMAL(10,2) NOT NULL DEFAULT 15.00,
    UNIQUE(bus_id, numero_asiento)
);

-- Tabla de pasajeros
CREATE TABLE IF NOT EXISTS pasajeros (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    direccion TEXT,
    celular VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas (mejorada con restricciones)
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    pasajero_id INT NOT NULL REFERENCES pasajeros(id) ON DELETE CASCADE,
    bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    frecuencia_id INT NOT NULL REFERENCES frecuencias(id) ON DELETE CASCADE,
    fecha_viaje DATE NOT NULL,
    asientos_seleccionados JSONB NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('tarjeta', 'transferencia', 'efectivo')),
    pago_confirmado BOOLEAN NOT NULL DEFAULT false,
    factura_generada BOOLEAN NOT NULL DEFAULT false,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (fecha_viaje > CURRENT_DATE)
);

-- Tabla de pagos (nueva tabla para rastrear pagos)
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(20) NOT NULL,
    referencia VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'completado', 'rechazado', 'reembolsado')),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas (nueva tabla para almacenar facturas)
CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    detalles JSONB NOT NULL
);

-- Insertar rutas completas
INSERT INTO rutas (nombre, buses_disponibles, descripcion) VALUES
('Quito-Guayaquil', 8, 'Ruta directa Quito a Guayaquil'),
('Quito-Cuenca', 6, 'Ruta directa Quito a Cuenca'),
('Quito-Manta', 5, 'Ruta directa Quito a Manta'),
('Quito-Tulcán', 4, 'Ruta directa Quito a Tulcán'),
('Quito-Loja', 4, 'Ruta directa Quito a Loja'),
('Quito-Lago Agrio', 4, 'Ruta directa Quito a Lago Agrio'),
('Quito-Esmeraldas', 4, 'Ruta directa Quito a Esmeraldas'),
('Quito-Ambato', 6, 'Ruta directa Quito a Ambato'),
('Quito-Riobamba', 5, 'Ruta directa Quito a Riobamba'),
('Quito-Ibarra', 4, 'Ruta directa Quito a Ibarra')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar frecuencias para cada ruta
WITH rutas_frecuencias AS (
  SELECT id, 
         CASE 
           WHEN nombre LIKE '%Guayaquil%' THEN 8
           WHEN nombre LIKE '%Cuenca%' THEN 6
           WHEN nombre LIKE '%Manta%' THEN 5
           ELSE 4
         END AS buses
  FROM rutas
)
INSERT INTO frecuencias (ruta_id, hora_salida)
SELECT r.id, 
       CASE 
         WHEN i <= r.buses/2 THEN make_time(6 + (i-1)*2, 0, 0)
         ELSE make_time(13 + (i - r.buses/2 - 1)*2, 0, 0)
       END
FROM rutas_frecuencias r
CROSS JOIN generate_series(1, r.buses) AS i
ON CONFLICT DO NOTHING;

-- Insertar buses para cada ruta
INSERT INTO buses (ruta_id, numero_bus, capacidad, modelo, placa)
SELECT r.id, 
       'BUS-' || r.id || '-' || generate_series(1, r.buses_disponibles),
       40,
       CASE 
         WHEN r.nombre LIKE '%Guayaquil%' THEN 'Mercedes-Benz Tourismo'
         WHEN r.nombre LIKE '%Cuenca%' THEN 'Volvo 9700'
         ELSE 'Scania K320'
       END,
       'ABC-' || LPAD((r.id*10 + generate_series(1, r.buses_disponibles))::text, 3, '0')
FROM rutas r
ON CONFLICT DO NOTHING;

-- Insertar asientos para cada bus (estructura corregida)
INSERT INTO asientos (bus_id, numero_asiento, fila, tipo, ubicacion)
SELECT
    b.id,
    asiento_num,
    ((asiento_num - 1) / 4) + 1 AS fila,
    CASE 
      WHEN asiento_num <= 4 THEN 'premium'
      WHEN asiento_num BETWEEN 5 AND 8 THEN 'normal'
      ELSE 'normal'
    END AS tipo,
    CASE
        WHEN (asiento_num - 1) % 4 = 0 THEN 'ventana_izq'
        WHEN (asiento_num - 1) % 4 = 1 THEN 'pasillo_izq'
        WHEN (asiento_num - 1) % 4 = 2 THEN 'pasillo_der'
        WHEN (asiento_num - 1) % 4 = 3 THEN 'ventana_der'
    END AS ubicacion
FROM buses b
CROSS JOIN generate_series(1, 40) AS asiento_num
ON CONFLICT DO NOTHING;

-- Insertar pasajeros de prueba
INSERT INTO pasajeros (cedula, nombre, apellido, celular, email) VALUES
('1712345678', 'Juan', 'Pérez', '0987654321', 'juan.perez@example.com'),
('1723456789', 'María', 'Gómez', '0998765432', 'maria.gomez@example.com'),
('1734567890', 'Carlos', 'Rodríguez', '0976543210', 'carlos.rod@example.com'),
('1745678901', 'Ana', 'Martínez', '0965432109', 'ana.martinez@example.com'),
('1756789012', 'Luis', 'Fernández', '0954321098', 'luis.fernandez@example.com')
ON CONFLICT (cedula) DO NOTHING;

-- Insertar reservas de prueba
WITH reserva_data AS (
  SELECT 
    p.id AS pasajero_id,
    b.id AS bus_id,
    f.id AS frecuencia_id,
    CURRENT_DATE + INTERVAL '7 days' AS fecha_viaje,
    ARRAY(SELECT id FROM asientos WHERE bus_id = b.id ORDER BY RANDOM() LIMIT 3) AS asientos
  FROM pasajeros p
  CROSS JOIN buses b
  JOIN frecuencias f ON f.ruta_id = b.ruta_id
  WHERE b.ruta_id = (SELECT id FROM rutas WHERE nombre = 'Quito-Guayaquil' LIMIT 1)
  LIMIT 5
)
INSERT INTO reservas (pasajero_id, bus_id, frecuencia_id, fecha_viaje, asientos_seleccionados, metodo_pago, pago_confirmado)
SELECT 
  pasajero_id,
  bus_id,
  frecuencia_id,
  fecha_viaje,
  asientos::jsonb,
  CASE WHEN RANDOM() > 0.5 THEN 'tarjeta' ELSE 'transferencia' END,
  true
FROM reserva_data;

-- Actualizar asientos reservados
UPDATE asientos a
SET ocupado = true
FROM reservas r, jsonb_array_elements_text(r.asientos_seleccionados) AS asiento_id
WHERE a.id = asiento_id::int;

-- Insertar pagos de prueba
INSERT INTO pagos (reserva_id, monto, metodo, referencia, estado)
SELECT 
  r.id,
  (SELECT COUNT(*) * 15.00 FROM jsonb_array_elements(r.asientos_seleccionados)),
  r.metodo_pago,
  'PAY-' || r.id || '-' || EXTRACT(EPOCH FROM NOW()),
  'completado'
FROM reservas r;

-- Insertar facturas de prueba
INSERT INTO facturas (reserva_id, numero_factura, subtotal, iva, total, detalles)
SELECT 
  r.id,
  'FAC-' || r.id || '-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(MONTH FROM NOW())::text, 2, '0'),
  (SELECT COUNT(*) * 15.00 FROM jsonb_array_elements(r.asientos_seleccionados)),
  (SELECT COUNT(*) * 15.00 * 0.12 FROM jsonb_array_elements(r.asientos_seleccionados)),
  (SELECT COUNT(*) * 15.00 * 1.12 FROM jsonb_array_elements(r.asientos_seleccionados)),
  jsonb_build_object(
    'pasajero', jsonb_build_object(
      'nombre', p.nombre,
      'apellido', p.apellido,
      'cedula', p.cedula
    ),
    'ruta', (SELECT nombre FROM rutas ru JOIN buses b ON b.ruta_id = ru.id WHERE b.id = r.bus_id),
    'fecha_viaje', r.fecha_viaje,
    'asientos', r.asientos_seleccionados
  )
FROM reservas r
JOIN pasajeros p ON p.id = r.pasajero_id;