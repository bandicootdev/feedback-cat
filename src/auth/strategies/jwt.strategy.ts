import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from '../../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IAuthJwtPayload } from '../interfaces/auth-jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IAuthJwtPayload): Promise<UserDocument> {
    const { email } = payload;
    const user: UserDocument = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
