import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { UpdateFeedbackDto } from '../dtos/update-feedback.dto';
import { nanoid } from 'nanoid/async';

interface IFeedbackService {
  getFeedBacksForProduct(id: string): Promise<FeedbackDocument[]>;
  getOneFeedBack(id: string): Promise<FeedbackDocument>;
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
  ) {}

  async getFeedBacksForProduct(id: string): Promise<FeedbackDocument[]> {
    let feedbacks: FeedbackDocument[];
    try {
      feedbacks = await this.feedbackModel.find({ productId: id }).exec();
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

  async getOneFeedBack(id: string): Promise<FeedbackDocument> {
    let feedBack: FeedbackDocument;
    try {
      feedBack = await this.feedbackModel.findOne({ id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!feedBack) {
      throw new NotFoundException();
    }
    return feedBack;
  }

  async createFeedBack(
    createFeedBackDto: CreateFeedbackDto,
  ): Promise<FeedbackDocument> {
    try {
      const feedback = new this.feedbackModel({
        id: await nanoid(),
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
      await this.getOneFeedBack(id);
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

  async deleteFeedBack(id: string): Promise<FeedbackDocument> {
    try {
      await this.getOneFeedBack(id);
      return this.feedbackModel.findOneAndRemove({ id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
