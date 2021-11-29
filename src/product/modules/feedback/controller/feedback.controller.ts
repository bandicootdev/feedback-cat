import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from '../service/feedback.service';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { UpdateFeedbackDto } from '../dtos/update-feedback.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from '../modules/comments/dtos/create-comment.dto';
import { CreateReplyDto } from '../modules/comments/modules/replies/dtos/create-replie.dto';

@Controller('product')
@UseGuards(AuthGuard())
// @Serialize(FeedBackDto)
export class FeedbackController {
  constructor(private readonly feedBackService: FeedbackService) {}

  @Get('/:id/feedback')
  getAllFeedBacksForProduct(@Param('id') id: string, @Query() sort) {
    return this.feedBackService.getFeedBacksForProduct(id, sort);
  }

  @Get('/:id/feedback/:idf')
  getFeedback(@Param('idf') id: string) {
    return this.feedBackService.getOneFeedback(id);
  }
  @Post('/feedback')
  createFeedBack(@Body() createFeedBack: CreateFeedbackDto, @Req() req) {
    return this.feedBackService.createFeedBack({
      user: req.user,
      ...createFeedBack,
    });
  }

  @Patch('/feedback/:id')
  updateFeedBack(@Body() body: UpdateFeedbackDto, @Param('id') id: string) {
    return this.feedBackService.updateFeedBack(id, body);
  }

  @Post('/feedback/:id/comment')
  createComment(
    @Body() body: CreateCommentDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.feedBackService.aggregateComment(id, {
      user: req.user,
      ...body,
    });
  }

  @Post('/feedback/:idf/comment/:idc/reply')
  createReplie(
    @Body() body: CreateReplyDto,
    @Param('idf') feedbackId: string,
    @Param('idc') commentId: string,
    @Req() req,
  ) {
    return this.feedBackService.aggregateReplieForComment(
      feedbackId,
      commentId,
      {
        user: req.user,
        ...body,
      },
    );
  }
}
