import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { IUser } from '../../../../../../user/interfaces/user.interface';

export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Reply {
  @Transform(({ value }) => value.toString())
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, length: 250 })
  content: string;

  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({
    type: {
      _id: String,
      email: String,
      username: String,
    },
    required: true,
  })
  user: IUser;

  @Prop({
    type: {
      _id: String,
      email: String,
      username: String,
    },
    required: true,
  })
  replyingTo: IUser;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
