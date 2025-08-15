import { Router } from 'express';
import {getBusesPorRuta, getBusById } from '../controllers/busesController.js';

const router = Router();

router.get('/ruta/:rutaId', getBusesPorRuta);
router.get('/:id', getBusById);

export default router;