import pool from '../models/db.js';

export const getAsientosPorBus = async (req, res) => {
  try {
    const { busId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM asientos WHERE bus_id = $1 AND ocupado = false ORDER BY fila, numero_asiento',
      [busId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo asientos:', err);
    res.status(500).json({ error: 'Error al obtener asientos' });
  }
};

export const getAsientoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM asientos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asiento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo asiento:', err);
    res.status(500).json({ error: 'Error al obtener asiento' });
  }
};