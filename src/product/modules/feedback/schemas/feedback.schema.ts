import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';

export enum FeedBackStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  LIVE = 'LIVE',
}

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    type: String,
    index: true,
    required: true,
    unique: true,
  })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  upVotes: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  productId: string;

  @Prop({
    type: String,
    enum: FeedBackStatus,
    required: true,
    default: FeedBackStatus.PLANNED,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  @Prop()
  comments: ObjectId[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
