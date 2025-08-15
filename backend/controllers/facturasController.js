import pool from '../models/db.js';

export const generarFactura = async (req, res) => {
  try {
    const { reservaId } = req.body;
    
    if (!reservaId) {
      return res.status(400).json({ error: 'ID de reserva requerido' });
    }

    // Obtener datos de la reserva
    const reservaResult = await pool.query(`
      SELECT r.*, p.nombre, p.apellido, p.cedula, p.email, b.numero_bus, fr.hora_salida
      FROM reservas r
      JOIN pasajeros p ON r.pasajero_id = p.id
      JOIN buses b ON r.bus_id = b.id
      JOIN frecuencias fr ON r.frecuencia_id = fr.id
      WHERE r.id = $1
    `, [reservaId]);
    
    if (reservaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    const reserva = reservaResult.rows[0];
    
    // Marcar factura como generada
    await pool.query(
      'UPDATE reservas SET factura_generada = true WHERE id = $1',
      [reservaId]
    );
    
    // Generar factura
    const asientos = JSON.parse(reserva.asientos_seleccionados);
    const total = asientos.length * 15; // $15 por asiento
    
    const factura = {
      numero: `FAC-${reservaId}-${Date.now()}`,
      fecha: new Date().toISOString(),
      total: total,
      items: [`Boleto de bus x${asientos.length}`],
      pasajero: {
        nombre: `${reserva.nombre} ${reserva.apellido}`,
        cedula: reserva.cedula,
        email: reserva.email
      },
      reserva: {
        id: reserva.id,
        bus: reserva.numero_bus,
        fecha: reserva.fecha_viaje,
        hora: reserva.hora_salida
      },
      asientos: asientos.length
    };
    
    res.json(factura);
  } catch (err) {
    console.error('Error generando factura:', err);
    res.status(500).json({ error: 'Error al generar factura' });
  }
};