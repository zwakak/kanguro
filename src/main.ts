import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log'],
  });

  const config = new DocumentBuilder()
    .setTitle('Kanguro Test')
    .setDescription('This is the api documentation for the kanguro test app')
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: 'Accept-Language',
      schema: {
        example: 'en',
      },
      description: '(en) for English, (es) for Spanish',
    })
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
