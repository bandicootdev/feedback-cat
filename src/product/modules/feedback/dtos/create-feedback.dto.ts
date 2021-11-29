import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ICategory } from '../../category/interfaces/category.interface';
import { IProduct } from '../../../interfaces/product.interface';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsObject()
  product: IProduct;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsObject()
  category: ICategory;
}
