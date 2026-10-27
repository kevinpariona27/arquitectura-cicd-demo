const { createServer } = require('./app');

const PORT = process.env.PORT || 3000;
const server = createServer();

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Health Check activo en http://localhost:${PORT}/health`);
});
