import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schema/category.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

interface ICategoryService {
  getAllCategories(): Promise<CategoryDocument[]>;
  getOneCategory(id: string): Promise<CategoryDocument>;
}

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAllCategories(): Promise<CategoryDocument[]> {
    const categories: CategoryDocument[] =
      await this.internalGetAllCategories();

    if (!categories || categories.length === 0) {
      throw new HttpException(
        'Not Feedbacks for product',
        HttpStatus.NO_CONTENT,
      );
    }

    return categories;
  }

  async internalGetAllCategories(): Promise<CategoryDocument[]> {
    let categories: CategoryDocument[];
    try {
      categories = await this.categoryModel.find({}, 'name').exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return categories;
  }

  async getOneCategory(id: string): Promise<CategoryDocument> {
    let category: CategoryDocument;
    try {
      category = await this.categoryModel.findById({ id }).exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!category) {
      throw new HttpException('not found category', HttpStatus.NO_CONTENT);
    }
    return category;
  }

  async createIfNotExistsCategories(): Promise<void> {
    const newCategories = ['UI', 'UX', 'Enhancement', 'Bug', 'Feature'];
    const categoriesInDatabase = await this.internalGetAllCategories();
    if (categoriesInDatabase.length === 0) {
      const categoriesSchema = newCategories.map(
        (name) => new this.categoryModel({ id: nanoid(), name }),
      );
      const categoriesCreated = await this.categoryModel.insertMany(
        categoriesSchema,
      );
      this.logger.debug(
        `${categoriesCreated.length} categories were created in the database`,
      );
    }
    this.logger.debug('No categories were created');
  }
}
