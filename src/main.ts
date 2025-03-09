import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
}
bootstrap();
