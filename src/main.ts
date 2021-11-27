import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoryService } from './product/modules/category/service/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  const onTaskInitForBootstrap = app.get(CategoryService);
  await onTaskInitForBootstrap.createIfNotExistsCategories();
}
bootstrap();
