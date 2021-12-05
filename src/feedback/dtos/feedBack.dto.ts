import { Exclude, Expose } from 'class-transformer';
import { IUser } from '../../user/interfaces/user.interface';
import { ICategory } from '../modules/category/interfaces/category.interface';
import { ApiProperty } from '@nestjs/swagger';

export class FeedBackDto {
  @Exclude()
  @ApiProperty()
  readonly _id: string;

  @Exclude()
  @ApiProperty()
  readonly __v: number;

  @Expose()
  @ApiProperty()
  readonly id: string;

  @Expose()
  @ApiProperty()
  readonly title: string;

  @Expose()
  @ApiProperty()
  readonly description: string;

  @Expose()
  @ApiProperty()
  readonly upVotes: number;

  @Expose()
  @ApiProperty()
  readonly status: string;

  @Expose()
  @ApiProperty()
  readonly user: IUser;

  @Expose()
  @ApiProperty()
  readonly category: ICategory;

  @Expose()
  @ApiProperty()
  readonly createdAt: string;

  @Expose()
  @ApiProperty()
  readonly updatedAt: string;
}
