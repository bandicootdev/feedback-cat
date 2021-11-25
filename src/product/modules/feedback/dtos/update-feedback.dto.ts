import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedBackStatus } from '../schemas/feedback.schema';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(FeedBackStatus)
  status: FeedBackStatus;

  @IsOptional()
  @IsString()
  categoryId: string;
}
