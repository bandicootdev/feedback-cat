import { Module } from '@nestjs/common';
import { CommentsModule } from './modules/comments/comments.module';
import { CategoryModule } from '../category/category.module';
import { FeedbackService } from './service/feedback.service';
import { FeedbackController } from './controller/feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
    ]),
    CommentsModule,
    CategoryModule,
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
