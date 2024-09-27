import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted:true,
      transform: true,  //transforma los datos a los tipos que se le indique en los DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  await app.listen(3000);

}
bootstrap();
