import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../schemas/comments.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { RepliesService } from '../modules/replies/service/replies.service';
import { CreateReplyDto } from '../modules/replies/dtos/create-replie.dto';
import { ReplyDocument } from '../modules/replies/schema/replie.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentModel: Model<CommentsDocument>,
    private repliesService: RepliesService,
  ) {}

  async getOneComment(id: string): Promise<CommentsDocument> {
    let comment: CommentsDocument;
    try {
      comment = await this.commentModel.findOne({ _id: id }).exec();
    } catch (err) {}
    if (!comment) {
      throw new HttpException('comment not found ', HttpStatus.NO_CONTENT);
    }
    return comment;
  }

  async getAllCommentsForFeedBack(
    feedbackId: string,
  ): Promise<CommentsDocument[]> {
    let comments: CommentsDocument[];
    try {
      comments = await this.commentModel
        .find({ feedbackId })
        .populate('replies', '_id replyingTo user content createdAt updatedAt')
        .exec();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return comments;
  }

  async createComment(
    createCommentDto: CreateCommentDto & { feedbackId: string },
  ): Promise<CommentsDocument> {
    try {
      const comment = new this.commentModel({ ...createCommentDto });
      return comment.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async aggregateReply(
    id: string,
    createReplyDto: CreateReplyDto,
  ): Promise<ReplyDocument> {
    let reply: ReplyDocument;
    try {
      reply = await this.repliesService.createReply({
        commentId: id,
        ...createReplyDto,
      });
      await this.commentModel.updateOne(
        { _id: id },
        { $push: { replies: reply._id.toString() } },
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return reply;
  }

  async deleteCommentsWithReplies(idc: string[], idr: string[]): Promise<void> {
    try {
      await this.repliesService.deleteReplies(idr);
      await this.commentModel.deleteMany({ id: idc });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
