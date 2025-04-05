import { Body, Controller, Get, Post, Headers, BadRequestException, Param, NotFoundException, Query, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { FreeCommunityService} from './free-community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('free-community')
export class FreeCommunityController {
  constructor(
    private readonly freeCommunityService: FreeCommunityService,
  ) {}

  //글 작성
  @Post('test/posts')
  async createPostTest(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id 헤더가 필요합니다');
    }

    const createdPost = await this.freeCommunityService.createPost(
      userId,
      dto.title,
      dto.content,
    );

    return { post: createdPost };
  }

  /**
   * 게시글 수정
   * @param postId 
   * @param userId 
   * @param dto 
   * @returns 
   */
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    if (!userId) throw new BadRequestException('유저 정보가 없습니다');

    return await this.freeCommunityService.updatePost(
      userId,
      postId,
      dto.title,
      dto.content,
    );
  }
  
  /**
   * 게시글 삭제
   * @param postId 
   * @param userId 
   * @returns 
   */
  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) throw new BadRequestException('유저 정보가 없습니다');

    return await this.freeCommunityService.deletePost(userId, postId);
  }
  
  /**
   * 게시글 단건 조회 (테스트용)
   * @param id 게시글 ID
   * @returns 게시글 정보
   */
    @Get('test/posts/:id')
    async getPostById(@Param('id') id: string) {
      const post = await this.freeCommunityService.getPostById(+id);
  
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다');
      }
  
      return { post: post };
    }

    /**
     * 게시글 목록 조회 (무한 스크롤, 테스트용)
     * @param lastPostId 마지막으로 받은 게시글 ID (선택)
     * @returns 최신순 게시글 목록
     */
    @Get('test/posts')
    async getPosts(@Query('lastPostId') lastPostId?: string) {
      const posts = await this.freeCommunityService.getPosts(+lastPostId);

      return { posts };
    }

    /**
     * 
     * @returns 인기순 게시글 목록
     */
    @Get('test/posts/popular')
    async getPopularPosts() {
      const posts = await this.freeCommunityService.getPopularPosts();

      return { posts };
    }
  

  /**
   * 좋아요 추가
   * @param postId 
   * @param userId 
   * @returns 
   */
  @Post(':id/like')
  async likePost(
    @Param('id') postId: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    await this.freeCommunityService.likePost(userId, +postId);
    return { message: '좋아요 추가 완료' };
  }

  /**
   * 좋아요 취소
   * @param postId 
   * @param userId 
   * @returns 
   */
  @Delete(':id/like')
  async unlikePost(
    @Param('id') postId: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    await this.freeCommunityService.unlikePost(userId, +postId);
    return { message: '좋아요 취소 완료' };
  }

  /**
   * 좋아요 여부 확인
   * @param postId 
   * @param userId 
   * @returns 
   */
  @Get(':id/like/status')
  async hasLiked(
    @Param('id') postId: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    const hasLiked = await this.freeCommunityService.hasLiked(userId, +postId);
    return { hasLiked };
  }

    /**
   * 댓글 or 대댓글 작성
   * @param postId 게시글 ID
   * @param userId 유저 ID (헤더에서)
   * @param dto 댓글 내용 + optional parentId
   */
    @Post(':id/comments')
    async writeComment(
      @Param('id') postId: string,
      @Headers('x-user-id') userId: string,
      @Body() dto: CreateCommentDto,
    ) {
      if (!userId) {
        throw new BadRequestException('유저 정보가 없습니다');
      }
  
      const comment = await this.freeCommunityService.writeComment(
        userId,
        +postId,
        dto.content,
        dto.parentId,
      );
  
      return { comment };
    }
  
  /**
   * 댓글 목록 조회(계층으로 묶어서)
   * @param postId 
   * @returns 
   */
  @Get(':id/comments')
  async getComments(@Param('id', ParseIntPipe) postId: number) {
    const comments = await this.freeCommunityService.getCommentsByPostId(postId);
    return { comments };
  }

  /**
   * 댓글 삭제
   * @param commentId 
   * @param userId 
   * @returns 
   */
  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    return await this.freeCommunityService.deleteComment(userId, commentId);
  }

  /**
   * 댓글 좋아요 추가 
   * @param commentId 
   * @param userId 
   * @returns 
   */
  @Post(':id/like')
  async likeComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    await this.freeCommunityService.likeComment(userId, commentId);
    return { message: '댓글 좋아요 완료' };
  }

  /**
   * 댓글 좋아요 취소
   * @param commentId 
   * @param userId 
   * @returns 
   */
  @Delete(':id/like')
  async unlikeComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    await this.freeCommunityService.unlikeComment(userId, commentId);
    return { message: '댓글 좋아요 취소 완료' };
  }

  /**
   * 댓글 좋아요 여부 확인
   * @param commentId 
   * @param userId 
   * @returns 
   */
  @Get(':id/like/status')
  async hasLikedComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('유저 정보가 없습니다');
    }

    const hasLiked = await this.freeCommunityService.hasLikedComment(userId, commentId);
    return { hasLiked };
  }

}
