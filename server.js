import express from 'express';
import { Pool } from 'pg';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'transporte',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(bodyParser.json());

// Rutas para vehículos
app.get('/api/vehiculos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});

// Rutas para reservas
app.get('/api/reservas', async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM reservas WHERE email = $1 ORDER BY travel_date DESC',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

app.post('/api/reservas', async (req, res) => {
  const { fullName, email, phone, travelDate, passengers, vehicleId, notes } = req.body;
  
  // Validación básica
  if (!fullName || !email || !travelDate || !vehicleId) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    // Verificar que el vehículo existe
    const vehicleResult = await pool.query('SELECT * FROM vehiculos WHERE id = $1', [vehicleId]);
    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    const result = await pool.query(
      `INSERT INTO reservas 
      (full_name, email, phone, travel_date, passengers, vehicle_id, notes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [fullName, email, phone, new Date(travelDate), passengers, vehicleId, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});