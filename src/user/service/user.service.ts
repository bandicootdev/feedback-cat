import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SignUpDto } from '../../auth/dtos/sign-up.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

interface IUserService {
  createUser(createUserDto: CreateUserDto);
  getUserByEmail(email): Promise<UserDocument>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserByEmail(email): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ email });
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NO_CONTENT);
    }
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto | SignUpDto,
  ): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      const userRecord = await user.save();
      return userRecord;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException(
          `${Object.keys(err.keyValue)} -> ${Object.values(
            err.keyValue,
          )} already exists`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ id });
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NO_CONTENT);
    }
    return user;
  }
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.getUserById(id);
    return this.userModel.findByIdAndUpdate({ _id: id }, { ...updateUserDto }).exec();
  }
}
