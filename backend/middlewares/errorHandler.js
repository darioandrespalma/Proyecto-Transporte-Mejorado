export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en la solicitud' });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};