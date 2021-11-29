import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { IUser } from '../../../../../../../../user/interfaces/user.interface';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsObject()
  replyingTo: IUser;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  content: string;
}
