import { Module } from '@nestjs/common';
import { FeedbackstatusService } from './service/feedbackstatus.service';
import { FeedbackstatusController } from './controller/feedbackstatus.controller';

@Module({
  providers: [FeedbackstatusService],
  controllers: [FeedbackstatusController],
})
export class FeedbackstatusModule {}
