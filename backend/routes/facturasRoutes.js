import { Router } from 'express';
import { generarFactura } from '../controllers/facturasController.js';

const router = Router();

router.post('/reserva/:reservaId', generarFactura); // Ruta RESTful corregida

export default router;