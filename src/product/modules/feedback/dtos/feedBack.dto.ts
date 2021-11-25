import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class FeedBackDto {
  @Exclude()
  @IsMongoId()
  _id: ObjectId;

  @Exclude()
  __v: number;

  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  upVotes: number;
}
