import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CategoryDto {
  @Exclude()
  @IsMongoId()
  _id: ObjectId;

  @Exclude()
  __v: number;

  @Expose()
  id: string;

  @Expose()
  name: string;
}
