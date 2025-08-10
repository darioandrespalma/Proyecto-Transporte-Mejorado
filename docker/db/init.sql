    -- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    capacidad INT NOT NULL DEFAULT 4,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    travel_date TIMESTAMP NOT NULL,
    passengers INT NOT NULL,
    vehicle_id INT NOT NULL REFERENCES vehiculos(id),
    notes TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales de vehículos
INSERT INTO vehiculos (marca, modelo, placa, capacidad) VALUES
('Volvo', 'XC90', 'ABC-123', 8),
('Scania', 'R500', 'XYZ-789', 12),
('Mercedes-Benz', 'Actros', 'DEF-456', 16),
('Toyota', 'Hiace', 'GHI-789', 12),
('Ford', 'Transit', 'JKL-012', 10)
ON CONFLICT (placa) DO NOTHING;

-- Datos iniciales de reservas
INSERT INTO reservas (full_name, email, phone, travel_date, passengers, vehicle_id, notes) VALUES
('Juan Pérez', 'juan@example.com', '3001234567', '2023-12-15 08:00:00', 3, 1, 'Necesito silla para bebé'),
('María Gómez', 'maria@example.com', '3109876543', '2023-12-20 14:30:00', 5, 3, 'Viaje al aeropuerto')
ON CONFLICT DO NOTHING;