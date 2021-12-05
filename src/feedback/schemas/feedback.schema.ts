import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import {
  Comments,
  CommentsDocument,
} from '../modules/comments/schemas/comments.schema';
import { IUser } from '../../user/interfaces/user.interface';
import { ICategory } from '../modules/category/interfaces/category.interface';

export enum FeedBackStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  LIVE = 'LIVE',
  SUGGESTION = 'SUGGESTION',
}

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Feedback {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  upVotes: number;

  @Prop({ type: String, required: true })
  description: string;

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
      name: String,
    },
  })
  category: ICategory;

  @Prop({
    type: String,
    enum: FeedBackStatus,
    required: true,
    default: FeedBackStatus.SUGGESTION,
  })
  status: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Comments.name,
    },
  ])
  comments: string[] | CommentsDocument[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
