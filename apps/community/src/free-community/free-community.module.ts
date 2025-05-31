import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeCommunityController } from './free-community.controller';
import { FreeCommunityService } from './free-community.service';
import { Post } from './entity/post.entity';
import { PostComment } from './entity/post-comment.entity';
import { PostLike } from './entity/post-like.entity';
import { CommentLike } from './entity/comment-like.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostComment, PostLike, CommentLike]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user',
          port: 5000,
        },
      },
    ]),
  ],
  controllers: [FreeCommunityController],
  providers: [FreeCommunityService],
  exports: [FreeCommunityService],
})
export class FreeCommunityModule {}
