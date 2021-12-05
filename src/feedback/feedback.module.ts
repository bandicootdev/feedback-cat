import { Module } from '@nestjs/common';
import { FeedbackService } from './service/feedback.service';
import { FeedbackController } from './controller/feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { CommentsModule } from './modules/comments/comments.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
    ]),
    CategoryModule,
    AuthModule,
    CommentsModule,
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
