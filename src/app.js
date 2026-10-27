const http = require('node:http');

// =========================================================================
// VARIABLES PARA MODIFICAR EN VIVO FRENTE AL PROFESOR
// =========================================================================
const VERSION_ACTUAL = "1.0.0"; // Kevin/Verton: Cambiar a "2.0.0" en Escenario 1 (Happy Path)
const VERSION_ESTABLE_ANTERIOR = "0.9.0"; // Versión lista para Rollback de Miriam
const ESTADO_SALUD = "healthy"; // Miriam: Cambiar a "error" en Escenario 2 (Quality Gate)
const MENSAJE_DESPLIEGUE = "Sistema Operativo y Validado por el Pipeline CI/CD";

// Métricas DORA (Responsable: Pozo)
const METRICAS_DORA = {
  deploymentFrequency: "Múltiples despliegues diarios (On-Demand en cada push)",
  leadTimeForChanges: "< 1 minuto (Automatizado con GitHub Actions)",
  changeFailureRate: "0% en producción (Bloqueado en CI por Quality Gates)",
  timeToRestoreService: "< 15 segundos (Auto-Rollback mediante Health Check)"
};

const requestHandler = (req, res) => {
  // Ruta 1: Endpoint /health para monitoreo y Rollback (Miriam)
  if (req.url === '/health') {
    const codigoHttp = ESTADO_SALUD === 'healthy' ? 200 : 500;
    res.writeHead(codigoHttp, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: ESTADO_SALUD,
      versionActual: VERSION_ACTUAL,
      rollbackDisponible: VERSION_ESTABLE_ANTERIOR,
      doraMetrics: METRICAS_DORA,
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  // Ruta 2: Dashboard Visual para proyectar en el salón
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>CI/CD — Arquitectura de Software</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 30px; display: flex; justify-content: center; }
        .container { max-width: 780px; width: 100%; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 26px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        .badge { display: inline-block; background: #0d9488; color: white; padding: 6px 14px; border-radius: 999px; font-weight: bold; font-size: 13px; }
        h1 { margin: 14px 0 8px 0; font-size: 24px; color: #38bdf8; }
        h2 { margin: 0 0 14px 0; font-size: 18px; color: #facc15; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
        .box { background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 8px; font-size: 13px; }
        .box strong { color: #94a3b8; display: block; margin-bottom: 4px; }
        .team { font-size: 13px; color: #cbd5e1; margin-top: 16px; border-top: 1px solid #334155; padding-top: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <span class="badge">VERSIÓN EN PRODUCCIÓN: v${VERSION_ACTUAL}</span>
          <h1>Arquitectura de Software — Pipeline CI/CD Activo</h1>
          <p>${MENSAJE_DESPLIEGUE}</p>
          <div class="grid">
            <div class="box"><strong>Estado Health Check (/health)</strong>${ESTADO_SALUD.toUpperCase()} (HTTP 200)</div>
            <div class="box"><strong>Registro de Contenedor (Zaga)</strong>ghcr.io (Multi-Stage Docker)</div>
            <div class="box"><strong>Versión Rollback Lista (Miriam)</strong>v${VERSION_ESTABLE_ANTERIOR}</div>
            <div class="box"><strong>Seguridad DevSecOps (Pozo)</strong>Escaneo Trivy Activo</div>
          </div>
          <div class="team">
            <strong>Equipo de Ingeniería de Sistemas:</strong> Kevin (Pipeline) | Pool (Testing) | Zaga (Docker) | Verton (Cloud CD) | Miriam (Resiliencia/Health) | Pozo (DevSecOps/DORA)
          </div>
        </div>

        <div class="card">
          <h2>Panel de Métricas DORA en Tiempo Real (Responsable: Pozo)</h2>
          <div class="grid">
            <div class="box"><strong>1. Deployment Frequency</strong>${METRICAS_DORA.deploymentFrequency}</div>
            <div class="box"><strong>2. Lead Time for Changes</strong>${METRICAS_DORA.leadTimeForChanges}</div>
            <div class="box"><strong>3. Change Failure Rate</strong>${METRICAS_DORA.changeFailureRate}</div>
            <div class="box"><strong>4. Time to Restore (MTTR)</strong>${METRICAS_DORA.timeToRestoreService}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
};

const createServer = () => http.createServer(requestHandler);

module.exports = { createServer, VERSION_ACTUAL, VERSION_ESTABLE_ANTERIOR, ESTADO_SALUD, METRICAS_DORA };
