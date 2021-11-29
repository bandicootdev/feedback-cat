import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { IAuthJwtPayload } from '../interfaces/auth-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ user: Partial<UserDocument>; accessToken: string }> {
    const user = await this.userService.getUserByEmail(signInDto.email);
    await bcrypt.compare(signInDto.password, user.password);
    if (user && (await bcrypt.compare(signInDto.password, user.password))) {
      const payload: IAuthJwtPayload = {
        email: signInDto.email,
        username: user.username,
      };
      const accessToken: string = await this.jwtService.signAsync(payload);
      return {
        user: {
          email: user.email,
          username: user.username,
          id: user.id,
        },
        accessToken,
      };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async signUp(
    createUser: SignUpDto,
  ): Promise<{ user: Partial<UserDocument>; accessToken: string }> {
    try {
      const user = await this.userService.createUser(createUser);
      const payload: IAuthJwtPayload = {
        email: createUser.email,
        username: user.username,
      };
      const accessToken: string = await this.jwtService.signAsync(payload);
      return {
        user: {
          email: user.email,
          username: user.username,
          id: user.id,
        },
        accessToken,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
