import { Router } from 'express';
<<<<<<< HEAD
import {getBusesPorRuta, getBusById } from '../controllers/busesController.js';

const router = Router();

=======
import { getBusesDestacados, getBusesPorRuta, getBusById } from '../controllers/busesController.js';

const router = Router();

router.get('/destacados', getBusesDestacados); // Asegúrate de que esta línea esté presente
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
router.get('/ruta/:rutaId', getBusesPorRuta);
router.get('/:id', getBusById);

export default router;