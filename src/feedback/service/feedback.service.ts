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
import { ReplyDocument } from '../modules/comments/modules/replies/schema/replie.schema';
import { CreateReplyDto } from '../modules/comments/modules/replies/dtos/create-replie.dto';
import { IUser } from '../../user/interfaces/user.interface';
import { CategoryService } from '../modules/category/service/category.service';
import { ICategory } from '../modules/category/interfaces/category.interface';

interface IFeedbackService {
  getFeedbacks(): Promise<FeedbackDocument[]>;

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
    private categoryService: CategoryService,
    private commentService: CommentsService,
  ) {}

  async getFeedbacks(query?: {
    category: string;
    upVotes: string;
    comments: string;
  }): Promise<FeedbackDocument[]> {
    let feedbacks: FeedbackDocument[];
    try {
      if (query) {
        feedbacks = await this.feedbackModel
          .find(
            query.category
              ? {
                  'category._id': query.category,
                }
              : {},
            '_id status category user product description comments upVotes upVotes title createdAt updatedAt',
          )
          .populate('comments', '_id feedback user content createdAt updatedAt')
          .sort({
            upVotes: query.upVotes,
          })
          .exec();
      } else {
        feedbacks = await this.feedbackModel
          .find(
            {},
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
      feedBack = await this.feedbackModel
        .findOne({ _id: id })
        .populate('comments comments.replies')
        .exec();
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
      const category = await this.categoryService.getOneCategory(
        createFeedBackDto.category,
      );
      const feedback = new this.feedbackModel({
        ...createFeedBackDto,
        category,
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
    let category: ICategory;
    try {
      await this.getOneFeedback(id);
      if (typeof updateFeedBackDto.category === 'string') {
        category = await this.categoryService.getOneCategory(
          updateFeedBackDto.category,
        );
      }

      return this.feedbackModel
        .findOneAndUpdate(
          { _id: id },
          { ...updateFeedBackDto, category },
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

  async aggregateReplyForComment(
    id: string,
    idComment: string,
    createReply: CreateReplyDto & { user: IUser },
  ): Promise<ReplyDocument> {
    let reply: ReplyDocument;
    try {
      await this.getOneFeedback(id);
      await this.commentService.getOneComment(idComment);
      reply = await this.commentService.aggregateReply(idComment, {
        ...createReply,
        user: createReply.user,
      } as CreateReplyDto);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return reply;
  }

  async deleteFeedBack(id: string): Promise<FeedbackDocument> {
    try {
      const feedback = await this.getOneFeedback(id);
      const comments = feedback.comments.map((c) => c.id);
      const replies = feedback.comments.flatMap((c) =>
        c.replies.map((r) => r.id),
      );
      await this.commentService.deleteCommentsWithReplies(comments, replies);
      return this.feedbackModel.findOneAndRemove({ id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
