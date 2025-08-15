<<<<<<< HEAD
// routes funciona como el "mapa" que dice que URL corresponde a qué controlador.
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
import { Router } from 'express';
import { getAsientosPorBus, getAsientoById } from '../controllers/asientosController.js';

const router = Router();

router.get('/bus/:busId', getAsientosPorBus);
router.get('/:id', getAsientoById);

<<<<<<< HEAD
export default router;

/*
Cuando un cliente (por ejemplo, tu frontend) hace una petición HTTP como GET /rutas o GET /asientos/bus/1, 
el backend necesita saber qué código debe ejecutar para responder.

Los archivos de routes son como listas de direcciones que apuntan hacia los controladores (la lógica real 
que obtiene datos, procesa, etc.).

*/

=======
export default router;
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
