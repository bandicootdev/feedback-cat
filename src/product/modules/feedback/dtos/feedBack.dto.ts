import { Exclude, Expose } from 'class-transformer';
import { IUser } from '../../../../user/interfaces/user.interface';
import { ICategory } from '../../category/interfaces/category.interface';
import { IProduct } from '../../../interfaces/product.interface';

export class FeedBackDto {
  @Exclude()
  readonly _id: string;

  @Exclude()
  readonly __v: number;

  @Expose()
  readonly id: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly upVotes: number;

  @Expose()
  readonly status: string;

  @Expose()
  readonly user: IUser;

  @Expose()
  readonly category: ICategory;

  @Expose()
  readonly product: IProduct;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly updatedAt: string;
}
