import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductService } from '../service/product.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ProductDto } from '../dtos/product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
@Serialize(ProductDto)
@UseGuards(AuthGuard())
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
