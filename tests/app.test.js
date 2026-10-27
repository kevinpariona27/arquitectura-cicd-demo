const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createServer, VERSION_ACTUAL, ESTADO_SALUD } = require('../src/app');

// 1. PRUEBA UNITARIA: Validación de estado de salud
test('Prueba Unitaria 1 (Pool): El estado interno de salud debe ser "healthy"', () => {
  assert.strictEqual(
    ESTADO_SALUD,
    'healthy',
    'QUALITY GATE BLOQUEADO: Se detectó estado "error". El pipeline detiene el paso a producción.'
  );
});

// 2. PRUEBA UNITARIA: Validación de Versionado Semántico
test('Prueba Unitaria 2 (Pool): La versión debe cumplir el estándar SemVer (X.Y.Z)', () => {
  assert.match(
    VERSION_ACTUAL,
    /^\d+\.\d+\.\d+$/,
    'ERROR ARQUITECTÓNICO: La versión no cumple formato SemVer (ejemplo: 1.0.0).'
  );
});

// 3. PRUEBA DE INTEGRACIÓN: Petición HTTP real al endpoint /health (Pool y Miriam)
test('Prueba de Integración 3 (Pool/Miriam): GET /health debe responder HTTP 200', async () => {
  const server = createServer().listen(0);
  const { port } = server.address();

  try {
    const response = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/health`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(body) }));
      }).on('error', reject);
    });

    assert.strictEqual(response.statusCode, 200, 'El endpoint /health devolvió código 500');
    assert.strictEqual(response.data.status, 'healthy');
  } finally {
    server.close();
  }
});
