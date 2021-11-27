import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
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
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
