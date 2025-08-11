import pool from '../models/db.js';
import { validarCedulaEcuatoriana, validarEmail, validarTelefono } from '../utils/validators.js';

export const registrarPasajero = async (req, res) => {
  try {
    const { cedula, nombre, apellido, direccion, celular, email } = req.body;

    // Validaciones mejoradas
    if (!cedula || !nombre || !apellido) {
      return res.status(400).json({ error: 'Cédula, nombre y apellido son requeridos' });
    }

    if (!validarCedulaEcuatoriana(cedula)) {
      return res.status(400).json({ error: 'Cédula inválida' });
    }

    if (celular && !validarTelefono(celular)) {
      return res.status(400).json({ error: 'Teléfono inválido (debe tener 10 dígitos)' });
    }

    if (email && !validarEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Actualización parcial en caso de conflicto
    const result = await pool.query(
      `INSERT INTO pasajeros (cedula, nombre, apellido, direccion, celular, email)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (cedula) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         apellido = EXCLUDED.apellido,
         direccion = COALESCE(EXCLUDED.direccion, pasajeros.direccion),
         celular = COALESCE(EXCLUDED.celular, pasajeros.celular),
         email = COALESCE(EXCLUDED.email, pasajeros.email)
       RETURNING *`,
      [cedula, nombre, apellido, direccion || null, celular || null, email || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registrando pasajero:', err);
    
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un pasajero con esta cédula' });
    }
    
    res.status(500).json({ 
      error: 'Error al registrar pasajero',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};


export const getPasajeroByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    
    const result = await pool.query('SELECT * FROM pasajeros WHERE cedula = $1', [cedula]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pasajero no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo pasajero:', err);
    res.status(500).json({ error: 'Error al obtener pasajero' });
  }
};

export const getPasajeroById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM pasajeros WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pasajero no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo pasajero:', err);
    res.status(500).json({ error: 'Error al obtener pasajero' });
  }
};