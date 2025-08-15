import { Router } from 'express';
import { registrarPasajero, getPasajeroByCedula, getPasajeroById } from '../controllers/pasajerosController.js';

const router = Router();

router.post('/', registrarPasajero);
router.get('/cedula/:cedula', getPasajeroByCedula);
router.get('/:id', getPasajeroById);

export default router;