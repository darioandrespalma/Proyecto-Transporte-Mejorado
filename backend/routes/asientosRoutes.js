import { Router } from 'express';
import { getAsientosPorBus, getAsientoById } from '../controllers/asientosController.js';

const router = Router();

router.get('/bus/:busId', getAsientosPorBus);
router.get('/:id', getAsientoById);

export default router;