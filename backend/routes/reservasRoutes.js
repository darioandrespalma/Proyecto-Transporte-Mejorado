import { Router } from 'express';
import { crearReserva, getReservaById, getReservasByPasajero, confirmarPago } from '../controllers/reservasController.js';

const router = Router();

router.post('/', crearReserva);
router.get('/:id', getReservaById);
router.get('/pasajero/:pasajeroId', getReservasByPasajero);
router.put('/:id/confirmar-pago', confirmarPago); // Ruta RESTful corregida

export default router;