import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reply, ReplieDocument } from '../schema/replie.schema';
import { Model } from 'mongoose';
import { CreateReplyDto } from '../dtos/create-replie.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplieDocument>,
  ) {}

  async createReply(
    createReplyDto: CreateReplyDto & { commentId: string },
  ): Promise<ReplieDocument> {
    let reply: ReplieDocument;
    try {
      reply = new this.replyModel({ ...createReplyDto });
      return reply.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
