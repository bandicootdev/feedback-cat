import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FeedBackStatus } from '../schemas/feedback.schema';
import { ICategory } from '../modules/category/interfaces/category.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsEnum(FeedBackStatus)
  @ApiProperty()
  status: FeedBackStatus;

  @IsOptional()
  @IsString()
  @ApiProperty()
  category: string | ICategory;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  upVotes: number;
}
