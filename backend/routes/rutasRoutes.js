import { Router } from 'express';
import { getRutas, getRutaById, getFrecuenciasPorRuta } from '../controllers/rutasController.js';

const router = Router();

router.get('/', getRutas);
router.get('/:id', getRutaById);
router.get('/:rutaId/frecuencias', getFrecuenciasPorRuta);

export default router;