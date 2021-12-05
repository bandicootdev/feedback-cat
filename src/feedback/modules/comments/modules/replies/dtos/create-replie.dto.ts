import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { IUser } from '../../../../../../user/interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  replyingTo: IUser;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty()
  content: string;
}
