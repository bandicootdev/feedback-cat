import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @Exclude()
  @IsMongoId()
  @ApiProperty()
  _id: ObjectId;

  @Exclude()
  @ApiProperty()
  __v: number;

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;
}
