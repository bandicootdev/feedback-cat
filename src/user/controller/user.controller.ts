import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';

@Controller('user')
@UseGuards(AuthGuard())
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
