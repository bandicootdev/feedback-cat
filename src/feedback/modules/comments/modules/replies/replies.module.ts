import { Module } from '@nestjs/common';
import { RepliesService } from './service/replies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from './schema/replie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reply.name,
        schema: ReplySchema,
      },
    ]),
  ],
  providers: [RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
