import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { nanoid } from 'nanoid/async';

interface IProductService {
  getAllProduct(): Promise<ProductDocument[]>;
  createOneProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductDocument>;
}

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  getAllProduct(): Promise<ProductDocument[]> {
    try {
      return this.productModel.find().exec();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async createOneProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    try {
      const productSnapShot = new this.productModel({
        id: await nanoid(),
        ...createProductDto,
      });
      return productSnapShot.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
