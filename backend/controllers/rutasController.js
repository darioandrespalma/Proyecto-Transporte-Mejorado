import pool from '../models/db.js';

export const getRutas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rutas ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo rutas:', err);
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
};

export const getRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM rutas WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo ruta:', err);
    res.status(500).json({ error: 'Error al obtener ruta' });
  }
};

export const getFrecuenciasPorRuta = async (req, res) => {
  try {
    const { rutaId } = req.params;
    
    console.log('Buscando frecuencias para rutaId:', rutaId); // Debug
    
    // Verificar que la ruta exista primero
    const rutaResult = await pool.query('SELECT id FROM rutas WHERE id = $1', [rutaId]);
    if (rutaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    // Obtener frecuencias
    const result = await pool.query(
      `SELECT id, ruta_id, hora_salida, hora_llegada, dias_semana 
       FROM frecuencias 
       WHERE ruta_id = $1 
       ORDER BY hora_salida`,
      [rutaId]
    );
    
    console.log('Frecuencias encontradas:', result.rows.length); // Debug
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error obteniendo frecuencias:', err);
    res.status(500).json({ 
      error: 'Error al obtener frecuencias',
      detalle: err.message 
    });
  }
};