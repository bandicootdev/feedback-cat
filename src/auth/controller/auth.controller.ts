import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentials: SignUpDto) {
    return this.authService.signUp(authCredentials);
  }

  @Post('signIn')
  async signIn(@Body() authCredentials: SignInDto) {
    return this.authService.signIn(authCredentials);
  }
}
