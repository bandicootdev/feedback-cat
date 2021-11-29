import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../schemas/comments.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { RepliesService } from '../modules/replies/service/replies.service';
import { CreateReplyDto } from '../modules/replies/dtos/create-replie.dto';
import { ReplieDocument } from '../modules/replies/schema/replie.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentModel: Model<CommentsDocument>,
    private repliesService: RepliesService,
  ) {}

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
  ): Promise<ReplieDocument> {
    let reply: ReplieDocument;
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
}
