import pool from '../models/db.js';

export const procesarPago = async (req, res) => {
  try {
    const { reservaId, metodo, datosPago } = req.body;
    
    if (!reservaId || !metodo) {
      return res.status(400).json({ error: 'Datos incompletos para el pago' });
    }

    // Simular procesamiento de pago (90% éxito)
    const pagoExitoso = Math.random() > 0.1;
    
    if (pagoExitoso) {
      await pool.query(
        'UPDATE reservas SET pago_confirmado = true WHERE id = $1',
        [reservaId]
      );
      
      res.json({ 
        exito: true, 
        mensaje: 'Pago procesado exitosamente',
        referencia: `REF-${Date.now()}`
      });
    } else {
      res.status(400).json({ 
        exito: false, 
        mensaje: 'Pago rechazado por el banco' 
      });
    }
  } catch (err) {
    console.error('Error procesando pago:', err);
    res.status(500).json({ error: 'Error al procesar pago' });
  }
};