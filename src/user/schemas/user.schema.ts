import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  // @Transform(({ value }) => value.toString())
  // _id: ObjectId;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String, minlength: 8 })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
