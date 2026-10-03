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
    const frontendDist = process.env.PORTAL_FRONTEND_DIST || path.join(__dirname, '..', '..', 'frontend', 'dist');
    const express = require('express');
    app.use(express.static(frontendDist));
    
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
