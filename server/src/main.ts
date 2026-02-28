import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.setGlobalPrefix('api');
  if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(__dirname, '..', 'public');
    app.useStaticAssets(publicPath);
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  }

  app.use(cookieParser());

  console.log(`Server starting on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
