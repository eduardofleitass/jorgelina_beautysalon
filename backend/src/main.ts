import { NestFactory } from '@nestjs/core';
import './config/env';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const frontendDist =
      process.env.PORTAL_FRONTEND_DIST ||
      path.join(__dirname, '..', '..', 'frontend', 'dist');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const express = require('express');
    app.use(express.static(frontendDist));

    // SPA fallback: cualquier ruta que no sea /api devuelve index.html
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor Jorgelina Coiffure corriendo en http://localhost:${port}`);
  if (isProduction) {
    console.log('Modo: PRODUCCION (sirviendo frontend compilado)');
  } else {
    console.log('Modo: DESARROLLO');
  }
}

bootstrap().catch((err) => {
  if (err?.code === 'EADDRINUSE') {
    const puerto = process.env.PORT || 3001;
    console.error('');
    console.error('===============================================');
    console.error(`  El puerto ${puerto} ya esta ocupado.`);
    console.error('===============================================');
    console.error('  Causas habituales:');
    console.error(`   - Ya hay una instancia del sitio corriendo en ese puerto`);
    console.error('     (no hace falta arrancarla de nuevo).');
    console.error('   - Otro proyecto (ej: Portal de Herramientas) lo esta usando.');
    console.error('');
    console.error('  Ver quien lo tiene tomado:');
    console.error(`     netstat -ano | findstr :${puerto}`);
    console.error('  Cerrar ese proceso (reemplazar PID):');
    console.error('     taskkill /F /PID <PID>');
    console.error('');
    console.error(`  O usar otro puerto:  set PORT=3002 && npm run start:prod`);
    console.error('');
    process.exit(1);
  }
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
