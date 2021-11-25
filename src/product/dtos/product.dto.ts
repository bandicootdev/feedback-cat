import { ObjectId } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class ProductDto {
  @Exclude()
  @IsMongoId()
  _id: ObjectId;

  @Exclude()
  __v: number;

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
