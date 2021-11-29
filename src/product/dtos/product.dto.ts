import { IsMongoId } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class ProductDto {
  @Exclude()
  @IsMongoId()
  readonly _id: string;

  @Exclude()
  readonly __v: number;

  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;
}
