<<<<<<< HEAD
// Esta clase es el corazón del servidor backend.js, donde se configuran
// los middlewares, las rutas y se inicia el servidor.
// Arranca el servidor solo si la conexión a la base de datos es exitosa.
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
import express from 'express';
import bodyParser from 'body-parser';
import cors from './middlewares/cors.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
<<<<<<< HEAD
//  Conexion a la base de datos
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
import pool from './models/db.js';

// Importar rutas
import busesRoutes from './routes/busesRoutes.js';
import rutasRoutes from './routes/rutasRoutes.js';
import asientosRoutes from './routes/asientosRoutes.js';
import pasajerosRoutes from './routes/pasajerosRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';
import pagosRoutes from './routes/pagosRoutes.js';
import facturasRoutes from './routes/facturasRoutes.js';

<<<<<<< HEAD
// instancia principal del servidor.
=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
const app = express();
const port = process.env.PORT || 3000;

// Middleware
<<<<<<< HEAD

=======
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);
app.use(express.static('public'));

// Logging de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rutas API
app.use('/api/buses', busesRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/asientos', asientosRoutes);
app.use('/api/pasajeros', pasajerosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/facturas', facturasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Endpoint para verificar conexión a base de datos
app.get('/api/db-health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'Database OK' });
  } catch (error) {
    res.status(500).json({ status: 'Database Error', error: error.message });
  }
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor solo si la conexión a DB es exitosa
pool.query('SELECT 1')
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
      console.log(`🏥 Health check: http://localhost:${port}/api/health`);
      console.log(`📊 DB Health: http://localhost:${port}/api/db-health`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = () => {
      console.log('Recibida señal de apagado. Cerrando servidor...');
      server.close(() => {
        console.log('Servidor cerrado. Cerrando pool de conexiones...');
        pool.end(() => {
          console.log('Pool de conexiones cerrado. Saliendo...');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  })
  .catch(err => {
    console.error('❌ No se pudo iniciar el servidor. Error de conexión a DB:', err);
    process.exit(1);
  });