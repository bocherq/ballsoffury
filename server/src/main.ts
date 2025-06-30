import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(__dirname, '..', 'public');
    app.useStaticAssets(publicPath);
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) next();
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  console.log(`Server starting on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
