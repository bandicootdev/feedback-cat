import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import {
  Comments,
  CommentsDocument,
} from '../modules/comments/schemas/comments.schema';
import { IUser } from '../../../../user/interfaces/user.interface';
import { ICategory } from '../../category/interfaces/category.interface';
import { IProduct } from '../../../interfaces/product.interface';

export enum FeedBackStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  LIVE = 'LIVE',
}

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Feedback {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  upVotes: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: {
      _id: String,
      description: String,
      name: String,
    },
    required: true,
  })
  product: IProduct;

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
    required: true,
  })
  category: ICategory;

  @Prop({
    type: String,
    enum: FeedBackStatus,
    required: true,
    default: FeedBackStatus.PLANNED,
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
