import { Module } from '@nestjs/common';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    FeedbackModule,
    AuthModule,
    CategoryModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
