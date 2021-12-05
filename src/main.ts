import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoryService } from './feedback/modules/category/service/category.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Feedback api')
    .setDescription('simple feedback API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  const onTaskInitForBootstrap = app.get(CategoryService);
  await onTaskInitForBootstrap.createIfNotExistsCategories();
  await app.listen(3000);
}
bootstrap();
