import { Controller, Get, Post, Put, Delete, Body, Param, Headers, BadRequestException, Query, ParseIntPipe, Patch, UseGuards, Req, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('community')
@UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('posts')
  async createPost(
    @Req() req,
    @Body() data: any,
  ) {
    const userId = req.user.userId;
    return this.communityService.createPost({ userId, ...data });
  }

  @Patch('posts/:id')
  async updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req,
    @Body() data: any,
  ) {
    const userId = req.user.userId;
    return this.communityService.updatePost({ userId, postId, ...data });
  }

  @Delete('posts/:id')
  async deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.communityService.deletePost({ userId, postId });
  }

  @Get('posts/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.communityService.getPostById({ id });
  }

  @Get('posts')
  async getPosts(@Query('lastPostId') lastPostId?: string) {
    return this.communityService.getPosts({ lastPostId: lastPostId ? +lastPostId : undefined });
  }

  @Get('posts/popular')
  async getPopularPosts() {
    return this.communityService.getPopularPosts({});
  }

  @Post('posts/:id/like')
  async toggleLike(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.communityService.toggleLike({ userId, postId });
  }

  @Get('posts/:id/like/status')
  async hasLiked(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.communityService.hasLiked({ userId, postId });
  }

  @Post('posts/:id/comments')
  async writeComment(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req,
    @Body() data: any,
  ) {
    const userId = req.user.userId;
    return this.communityService.writeComment({ userId, postId, ...data });
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id', ParseIntPipe) postId: number) {
    return this.communityService.getCommentsByPostId({ postId });
  }

  @Delete('comments/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.communityService.deleteComment({ userId, commentId });
  }

  @Post('comments/:commentId/like')
  async toggleCommentLike(
    @Req() req,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const userId = req.user.userId;
    return this.communityService.toggleCommentLike(userId, commentId);
  }

  @Get('comments/:commentId/like')
  async hasLikedComment(
    @Req() req,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const userId = req.user.userId;
    return this.communityService.hasLikedComment(userId, commentId);
  }
}
