import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from '../service/feedback.service';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { UpdateFeedbackDto } from '../dtos/update-feedback.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from '../modules/comments/dtos/create-comment.dto';
import { CreateReplyDto } from '../modules/comments/modules/replies/dtos/create-replie.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('feedback')
@UseGuards(AuthGuard())
@ApiBearerAuth()
// @Serialize(FeedBackDto)
export class FeedbackController {
  constructor(private readonly feedBackService: FeedbackService) {}

  @Get('/')
  getAllFeedbacksForProduct(@Query() sort) {
    return this.feedBackService.getFeedbacks(sort);
  }

  @Get('/status')
  getStatus(@Res() res) {
    return res.status(200).json({
      status: [
        {
          id: 1,
          name: 'SUGGESTION',
        },
        {
          id: 2,
          name: 'PLANNED',
        },
        {
          id: 3,
          name: 'IN_PROGRESS',
        },
        {
          id: 4,
          name: 'LIVE',
        },
      ],
    });
  }

  @Get('/:id')
  getFeedback(@Param('id') id: string) {
    return this.feedBackService.getOneFeedback(id);
  }

  @Post('/')
  createFeedback(@Body() createFeedBack: CreateFeedbackDto, @Req() req) {
    return this.feedBackService.createFeedBack({
      user: req.user,
      ...createFeedBack,
    });
  }

  @Patch('/:id')
  updateFeedback(@Body() body: UpdateFeedbackDto, @Param('id') id: string) {
    return this.feedBackService.updateFeedBack(id, body);
  }

  @Delete('/:id')
  deleteFeedback(@Param('id') id: string) {
    return this.feedBackService.deleteFeedBack(id);
  }

  @Post('/:id/comment')
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

  @Post('/:id/comment/:idc/reply')
  createReply(
    @Body() body: CreateReplyDto,
    @Param('id') feedbackId: string,
    @Param('idc') commentId: string,
    @Req() req,
  ) {
    return this.feedBackService.aggregateReplyForComment(
      feedbackId,
      commentId,
      {
        user: req.user,
        ...body,
      },
    );
  }
}
