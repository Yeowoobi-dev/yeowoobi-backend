import { Controller } from '@nestjs/common';
import { FreeCommunityService } from './free-community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post as PostEntity } from './entity/post.entity';
import { PostComment } from './entity/post-comment.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('free-community')
export class FreeCommunityController {
  constructor(
    private readonly freeCommunityService: FreeCommunityService,
  ) {}

  @MessagePattern({ cmd: 'createPost' })
  async createPost(@Payload() data: { userId: string; title: string; content: string }) {
    return this.freeCommunityService.createPost(data.userId, data.title, data.content);
  }

  @MessagePattern({ cmd: 'getPosts' })
  async getPosts(@Payload() data: { lastPostId?: number }) {
    return this.freeCommunityService.getPosts(data.lastPostId);
  }

  @MessagePattern({ cmd: 'getPostById' })
  async getPostById(@Payload() data: { postId: number }) {
    return this.freeCommunityService.getPostById(data.postId);
  }

  @MessagePattern({ cmd: 'getPopularPosts' })
  async getPopularPosts() {
    return this.freeCommunityService.getPopularPosts();
  }

  @MessagePattern({ cmd: 'updatePost' })
  async updatePost(@Payload() data: { userId: string; postId: number; title?: string; content?: string }) {
    return this.freeCommunityService.updatePost(data.userId, data.postId, data.title, data.content);
  }

  @MessagePattern({ cmd: 'deletePost' })
  async deletePost(@Payload() data: { userId: string; postId: number }) {
    return this.freeCommunityService.deletePost(data.userId, data.postId);
  }

  @MessagePattern({ cmd: 'toggleLike' })
  async toggleLike(@Payload() data: { userId: string; postId: number }) {
    const isLiked = await this.freeCommunityService.toggleLike(data.userId, data.postId);
    return {
      message: isLiked ? '좋아요가 추가되었습니다' : '좋아요가 취소되었습니다',
      isLiked,
    };
  }

  @MessagePattern({ cmd: 'hasLiked' })
  async hasLiked(@Payload() data: { userId: string; postId: number }) {
    return this.freeCommunityService.hasLiked(data.userId, data.postId);
  }

  @MessagePattern({ cmd: 'writeComment' })
  async writeComment(@Payload() data: { userId: string; postId: number; content: string; parentId?: number }) {
    return this.freeCommunityService.writeComment(data.userId, data.postId, data.content, data.parentId);
  }

  @MessagePattern({ cmd: 'getComments' })
  async getComments(@Payload() data: { postId: number }) {
    return this.freeCommunityService.getCommentsByPostId(data.postId);
  }

  @MessagePattern({ cmd: 'deleteComment' })
  async deleteComment(@Payload() data: { userId: string; commentId: number }) {
    return this.freeCommunityService.deleteComment(data.userId, data.commentId);
  }

  @MessagePattern({ cmd: 'toggleCommentLike' })
  async toggleCommentLike(@Payload() data: { userId: string; commentId: number }) {
    return await this.freeCommunityService.toggleCommentLike(data.userId, data.commentId);
  }

  @MessagePattern({ cmd: 'hasLikedComment' })
  async hasLikedComment(@Payload() data: { userId: string; commentId: number }) {
    return await this.freeCommunityService.hasLikedComment(data.userId, data.commentId);
  }
}
