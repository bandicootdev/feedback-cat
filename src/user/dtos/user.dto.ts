import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UserDto {
  @Exclude()
  @IsMongoId()
  _id: ObjectId;

  @Exclude()
  __v: number;

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;
}
