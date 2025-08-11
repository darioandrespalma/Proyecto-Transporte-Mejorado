import { Router } from 'express';
import { getBusesDestacados, getBusesPorRuta, getBusById } from '../controllers/busesController.js';

const router = Router();

router.get('/destacados', getBusesDestacados); // Asegúrate de que esta línea esté presente
router.get('/ruta/:rutaId', getBusesPorRuta);
router.get('/:id', getBusById);

export default router;