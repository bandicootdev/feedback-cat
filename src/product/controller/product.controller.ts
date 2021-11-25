import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductService } from '../service/product.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ProductDto } from '../dtos/product.dto';

@Controller('product')
@Serialize(ProductDto)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProduct();
  }

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.createOneProduct(body);
  }
}
