import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Reply } from '../modules/replies/schema/replie.schema';
import { IUser } from '../../../../../../user/interfaces/user.interface';

export type CommentsDocument = Comments & Document;

@Schema({ timestamps: true })
export class Comments {
  @Transform(({ value }) => value.toString())
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, length: 250 })
  content: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Reply.name }])
  replies: string[];

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
    type: String,
    required: true,
  })
  feedbackId: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
