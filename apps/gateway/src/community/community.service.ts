import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommunityService {
  constructor(
    @Inject('COMMUNITY_SERVICE') private readonly communityClient: ClientProxy,
  ) {}

  async createPost(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'createPost' }, data)
    );
  }

  async getPosts(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'getPosts' }, data)
    );
  }

  async updatePost(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'updatePost' }, data)
    );
  }

  async deletePost(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'deletePost' }, data)
    );
  }

  async getPostById(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'getPostById' }, { postId: data.id })
    );
  }

  async getPopularPosts(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'getPopularPosts' }, data)
    );
  }

  async toggleLike(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'toggleLike' }, data)
    );
  }

  async hasLiked(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'hasLiked' }, data)
    );
  }

  async writeComment(data: { userId: string; postId: number; content: string; parentId?: number }) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'writeComment' }, {
        userId: data.userId,
        postId: data.postId,
        content: data.content,
        parentId: data.parentId
      })
    );
  }

  async getCommentsByPostId(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'getComments' }, { postId: data.postId })
    );
  }

  async deleteComment(data: any) {
    return firstValueFrom(
      this.communityClient.send({ cmd: 'deleteComment' }, data)
    );
  }

  async toggleCommentLike(userId: string, commentId: number) {
    return firstValueFrom(
      this.communityClient.send(
        { cmd: 'toggleCommentLike' },
        { userId, commentId }
      )
    );
  }

  async hasLikedComment(userId: string, commentId: number) {
    return firstValueFrom(
      this.communityClient.send(
        { cmd: 'hasLikedComment' },
        { userId, commentId }
      )
    );
  }
}
