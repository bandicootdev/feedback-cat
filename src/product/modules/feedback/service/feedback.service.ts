import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { UpdateFeedbackDto } from '../dtos/update-feedback.dto';
import { CommentsService } from '../modules/comments/service/comments.service';
import { CreateCommentDto } from '../modules/comments/dtos/create-comment.dto';
import { CommentsDocument } from '../modules/comments/schemas/comments.schema';
import { ReplieDocument } from '../modules/comments/modules/replies/schema/replie.schema';
import { CreateReplyDto } from '../modules/comments/modules/replies/dtos/create-replie.dto';
import { IUser } from '../../../../user/interfaces/user.interface';

interface IFeedbackService {
  getFeedBacksForProduct(id: string): Promise<FeedbackDocument[]>;
  getOneFeedback(id: string): Promise<FeedbackDocument>;
  createFeedBack(
    createFeedBackDto: CreateFeedbackDto,
  ): Promise<FeedbackDocument>;
  updateFeedBack(
    id: string,
    updateFeedBackDto: UpdateFeedbackDto,
  ): Promise<FeedbackDocument>;
  deleteFeedBack(id: string): Promise<FeedbackDocument>;
}

@Injectable()
export class FeedbackService implements IFeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    private commentService: CommentsService,
  ) {}

  async getFeedBacksForProduct(
    id: string,
    query?: {
      upVotes: string;
      comments: string;
    },
  ): Promise<FeedbackDocument[]> {
    let feedbacks: FeedbackDocument[];
    try {
      if (query) {
        feedbacks = await this.feedbackModel
          .find(
            { 'product._id': id },
            '_id status category user product description comments upVotes upVotes title createdAt updatedAt',
          )
          .populate('comments', '_id feedback user content createdAt updatedAt')
          .sort(query)
          .exec();
      } else {
        feedbacks = await this.feedbackModel
          .find(
            { 'product._id': id },
            '_id status category user product description comments upVotes upVotes title createdAt updatedAt',
          )
          .populate('comments', '_id feedback user content createdAt updatedAt')
          .sort({ createdAt: 'desc' })
          .exec();
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!feedbacks || feedbacks.length === 0) {
      throw new HttpException(
        'Not Feedbacks for product',
        HttpStatus.NO_CONTENT,
      );
    }
    return feedbacks;
  }

  async getOneFeedback(id: string): Promise<FeedbackDocument> {
    let feedBack: FeedbackDocument;
    let comments: CommentsDocument[];
    try {
      feedBack = await this.feedbackModel.findOne({ _id: id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!feedBack) {
      throw new HttpException('feedback not found', HttpStatus.NO_CONTENT);
    }

    try {
      comments = await this.commentService.getAllCommentsForFeedBack(
        feedBack._id.toString(),
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
    feedBack.comments = comments;
    return feedBack;
  }

  async createFeedBack(
    createFeedBackDto: CreateFeedbackDto & { user: IUser },
  ): Promise<FeedbackDocument> {
    try {
      const feedback = new this.feedbackModel({
        ...createFeedBackDto,
      });
      return feedback.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateFeedBack(
    id: string,
    updateFeedBackDto: UpdateFeedbackDto,
  ): Promise<FeedbackDocument> {
    try {
      await this.getOneFeedback(id);
      return this.feedbackModel
        .findOneAndUpdate(
          { id },
          { ...updateFeedBackDto },
          {
            returnOriginal: false,
          },
        )
        .exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async aggregateComment(
    id: string,
    createCommentDto: CreateCommentDto & { user: IUser },
  ): Promise<CommentsDocument> {
    let comment: CommentsDocument;
    try {
      comment = await this.commentService.createComment({
        feedbackId: id,
        ...createCommentDto,
      });
      await this.feedbackModel
        .updateOne({ _id: id }, { $push: { comments: comment._id.toString() } })
        .exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return comment;
  }

  async aggregateReplieForComment(
    id: string,
    idComment: string,
    createReply: CreateReplyDto & { user: IUser },
  ): Promise<ReplieDocument> {
    let replie: ReplieDocument;
    try {
      replie = await this.commentService.aggregateReply(idComment, createReply);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return replie;
  }

  async deleteFeedBack(id: string): Promise<FeedbackDocument> {
    try {
      await this.getOneFeedback(id);
      return this.feedbackModel.findOneAndRemove({ id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
