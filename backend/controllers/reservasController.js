import pool from '../models/db.js';

export const crearReserva = async (req, res) => {
  try {
    const { pasajeroId, busId, frecuenciaId, fechaViaje, asientos, metodoPago } = req.body;

    // Validaciones más robustas
    if (!pasajeroId || !busId || !frecuenciaId || !fechaViaje || !asientos || !metodoPago) {
      return res.status(400).json({ 
        error: 'Datos incompletos para la reserva',
        required: ['pasajeroId', 'busId', 'frecuenciaId', 'fechaViaje', 'asientos', 'metodoPago']
      });
    }

    if (!Array.isArray(asientos) || asientos.length === 0) {
      return res.status(400).json({ error: 'Debe seleccionar al menos un asiento' });
    }

    if (asientos.length > 40) {
      return res.status(400).json({ error: 'No se pueden reservar más de 40 asientos' });
    }

    // Validar que el método de pago sea válido
    const metodosValidos = ['transferencia', 'tarjeta'];
    if (!metodosValidos.includes(metodoPago)) {
      return res.status(400).json({ error: 'Método de pago no válido' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar que el pasajero exista
      const pasajeroResult = await client.query(
        'SELECT id FROM pasajeros WHERE id = $1',
        [pasajeroId]
      );
      
      if (pasajeroResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Pasajero no encontrado' });
      }
      
      // Verificar que el bus y frecuencia existan
      const busResult = await client.query(
        'SELECT id FROM buses WHERE id = $1',
        [busId]
      );
      
      if (busResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Bus no encontrado' });
      }
      
      const frecuenciaResult = await client.query(
        'SELECT id FROM frecuencias WHERE id = $1',
        [frecuenciaId]
      );
      
      if (frecuenciaResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Frecuencia no encontrada' });
      }
      
      // Verificar disponibilidad de asientos
      const asientosDisponibles = await client.query(
        'SELECT id FROM asientos WHERE id = ANY($1::int[]) AND ocupado = false FOR UPDATE',
        [asientos]
      );
      
      if (asientosDisponibles.rows.length !== asientos.length) {
        await client.query('ROLLBACK');
        const asientosOcupados = asientos.filter(id => 
          !asientosDisponibles.rows.some(row => row.id === id)
        );
        return res.status(400).json({ 
          error: 'Algunos asientos ya no están disponibles',
          asientosOcupados: asientosOcupados
        });
      }
      
      // Crear reserva
      const reservaResult = await client.query(
        `INSERT INTO reservas 
         (pasajero_id, bus_id, frecuencia_id, fecha_viaje, asientos_seleccionados, metodo_pago)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [pasajeroId, busId, frecuenciaId, fechaViaje, JSON.stringify(asientos), metodoPago]
      );
      
      const reserva = reservaResult.rows[0];
      
      // Marcar asientos como ocupados
      for (const asientoId of asientos) {
        await client.query(
          'UPDATE asientos SET ocupado = true WHERE id = $1',
          [asientoId]
        );
      }
      
      await client.query('COMMIT');
      
      // Obtener datos completos de la reserva para la respuesta
      const reservaCompleta = await getReservaCompleta(reserva.id);
      
      res.status(201).json({
        mensaje: 'Reserva creada exitosamente',
        reserva: reservaCompleta
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creando reserva:', err);
    res.status(500).json({ error: 'Error al crear reserva', detalle: err.message });
  }
};

<<<<<<< HEAD
// ----------------------------------------------------------------------------------------------------------------------------

=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
// Función auxiliar para obtener datos completos de reserva
async function getReservaCompleta(reservaId) {
  const result = await pool.query(`
    SELECT r.*, 
           p.nombre as pasajero_nombre, 
           p.apellido as pasajero_apellido,
           p.cedula as pasajero_cedula,
           p.email as pasajero_email,
           b.numero_bus,
           b.capacidad as bus_capacidad,
           fr.hora_salida,
<<<<<<< HEAD
=======
           fr.hora_llegada,
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
           rt.nombre as ruta_nombre
    FROM reservas r
    JOIN pasajeros p ON r.pasajero_id = p.id
    JOIN buses b ON r.bus_id = b.id
    JOIN frecuencias fr ON r.frecuencia_id = fr.id
    JOIN rutas rt ON b.ruta_id = rt.id
    WHERE r.id = $1
  `, [reservaId]);
  
  return result.rows[0];
}

<<<<<<< HEAD

// Controladores para ver si una reserva existe, obtener reservas por pasajero, confirmar pago y cancelar reserva
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
export const getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reserva = await getReservaCompleta(id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json(reserva);
  } catch (err) {
    console.error('Error obteniendo reserva:', err);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
};

<<<<<<< HEAD
// -----------------------------------------------------------------------------------------------------------------------------
// Lista todas las reservas de un pasajero especifico, incluyendo informacion de bus y hora de salida
// -----------------------------------------------------------------------------------------------------------------------------
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
export const getReservasByPasajero = async (req, res) => {
  try {
    const { pasajeroId } = req.params;
    
    const result = await pool.query(`
      SELECT r.*, b.numero_bus, fr.hora_salida, rt.nombre as ruta_nombre
      FROM reservas r
      JOIN buses b ON r.bus_id = b.id
      JOIN frecuencias fr ON r.frecuencia_id = fr.id
      JOIN rutas rt ON b.ruta_id = rt.id
      WHERE r.pasajero_id = $1
      ORDER BY r.fecha_viaje DESC, r.creado_en DESC
    `, [pasajeroId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo reservas:', err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

<<<<<<< HEAD

// -----------------------------------------------------------------------------------------------------------------------------
// Controladores para confirmar pago y cancelar reserva
// -----------------------------------------------------------------------------------------------------------------------------
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
export const confirmarPago = async (req, res) => {
  try {
    const { reservaId } = req.body;
    
    if (!reservaId) {
      return res.status(400).json({ error: 'ID de reserva requerido' });
    }
    
    const result = await pool.query(
      'UPDATE reservas SET pago_confirmado = true WHERE id = $1 RETURNING *',
      [reservaId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({
      mensaje: 'Pago confirmado exitosamente',
      reserva: result.rows[0]
    });
  } catch (err) {
    console.error('Error confirmando pago:', err);
    res.status(500).json({ error: 'Error al confirmar pago' });
  }
};

<<<<<<< HEAD

=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
export const cancelarReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener asientos de la reserva
      const reservaResult = await client.query(
        'SELECT asientos_seleccionados FROM reservas WHERE id = $1',
        [reservaId]
      );
      
      if (reservaResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      
      const asientos = JSON.parse(reservaResult.rows[0].asientos_seleccionados);
      
      // Marcar asientos como disponibles
      for (const asientoId of asientos) {
        await client.query(
          'UPDATE asientos SET ocupado = false WHERE id = $1',
          [asientoId]
        );
      }
      
      // Cancelar reserva
      await client.query(
        'UPDATE reservas SET estado = $1 WHERE id = $2',
        ['cancelada', reservaId]
      );
      
      await client.query('COMMIT');
      
      res.json({ mensaje: 'Reserva cancelada exitosamente' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error cancelando reserva:', err);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};