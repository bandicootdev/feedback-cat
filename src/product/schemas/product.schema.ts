import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
