import { Module } from '@nestjs/common';
import { CommentsService } from './service/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './schemas/comments.schema';
import { AuthModule } from '../../../auth/auth.module';
import { RepliesModule } from './modules/replies/replies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
    ]),
    AuthModule,
    RepliesModule,
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
