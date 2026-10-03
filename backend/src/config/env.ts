// Carga variables de entorno desde backend/.env (sin dependencias externas).
// Las credenciales de notificacion NUNCA van hardcodeadas en el codigo.
import * as fs from 'fs';
import * as path from 'path';

function cargarEnv(): void {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envPath)) return;

  const contenido = fs.readFileSync(envPath, 'utf-8');
  for (const linea of contenido.split(/\r?\n/)) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith('#')) continue;
    const idx = limpia.indexOf('=');
    if (idx === -1) continue;
    const clave = limpia.slice(0, idx).trim();
    let valor = limpia.slice(idx + 1).trim();
    // Quitar comillas envolventes si las hay
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (!(clave in process.env)) {
      process.env[clave] = valor;
    }
  }
}

cargarEnv();
