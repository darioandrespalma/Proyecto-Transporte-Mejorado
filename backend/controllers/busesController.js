import pool from '../models/db.js';

export const getBusesDestacados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.numero_bus, b.capacidad, r.nombre as ruta_nombre, r.id as ruta_id
      FROM buses b 
      JOIN rutas r ON b.ruta_id = r.id 
      ORDER BY RANDOM()
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en buses destacados:', err);
    res.status(500).json({ error: 'Error al obtener buses destacados' });
  }
};

export const getBusesPorRuta = async (req, res) => {
  try {
    const { rutaId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM buses WHERE ruta_id = $1 ORDER BY numero_bus',
      [rutaId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo buses:', err);
    res.status(500).json({ error: 'Error al obtener buses' });
  }
};

export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT b.*, r.nombre as ruta_nombre 
       FROM buses b 
       JOIN rutas r ON b.ruta_id = r.id 
       WHERE b.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo bus:', err);
    res.status(500).json({ error: 'Error al obtener bus' });
  }
};