import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'transporte',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Verificar conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conexión a PostgreSQL establecida');
  }
});

export default pool;