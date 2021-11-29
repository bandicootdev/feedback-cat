import { Module } from '@nestjs/common';
import { FeedbackService } from './service/feedback.service';
import { FeedbackController } from './controller/feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { AuthModule } from '../../../auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FeedbackstatusModule } from './modules/feedbackstatus/feedbackstatus.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
    ]),
    AuthModule,
    CommentsModule,
    FeedbackstatusModule,
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
