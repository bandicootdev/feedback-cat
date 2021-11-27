import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FeedbackService } from '../service/feedback.service';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { Serialize } from '../../../../interceptors/serialize.interceptor';
import { FeedBackDto } from '../dtos/feedBack.dto';
import { UpdateFeedbackDto } from '../dtos/update-feedback.dto';

@Controller('product')
@Serialize(FeedBackDto)
export class FeedbackController {
  constructor(private readonly feedBackService: FeedbackService) {}

  @Get('/:id/feedback')
  getAllFeedBacksForProduct(@Param('id') id: string) {
    return this.feedBackService.getFeedBacksForProduct(id);
  }

  @Post('/feedback')
  createFeedBack(@Body() createFeedBack: CreateFeedbackDto) {
    return this.feedBackService.createFeedBack(createFeedBack);
  }

  @Patch('/feedback/:id')
  updateFeedBack(@Body() body: UpdateFeedbackDto, @Param('id') id: string) {
    return this.feedBackService.updateFeedBack(id, body);
  }
}
