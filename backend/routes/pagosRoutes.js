import { Router } from 'express';
import { procesarPago } from '../controllers/pagosController.js';

const router = Router();

router.post('/procesar', procesarPago);

export default router;