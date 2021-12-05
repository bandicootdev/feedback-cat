import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reply, ReplyDocument } from '../schema/replie.schema';
import { Model } from 'mongoose';
import { CreateReplyDto } from '../dtos/create-replie.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
  ) {}

  async createReply(
    createReplyDto: CreateReplyDto & { commentId: string },
  ): Promise<ReplyDocument> {
    let reply: ReplyDocument;
    try {
      reply = new this.replyModel({ ...createReplyDto });
      return reply.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteReplies(ids: string[]): Promise<void> {
    await this.replyModel.deleteMany({ id: ids });
  }
}
