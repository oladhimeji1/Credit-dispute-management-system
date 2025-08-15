import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}
bootstrap();