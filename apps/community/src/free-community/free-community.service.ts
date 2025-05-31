import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostLike } from './entity/post-like.entity';
import { PostComment } from './entity/post-comment.entity';
import { CommentLike } from './entity/comment-like.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FreeCommunityService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  /**
   * 게시글 생성
   * @param userId 
   * @param dto 
   * @returns 생성된 게시글 정보 반환
   */
  async createPost(userId: string, title: string, content: string) {
    const post = this.postRepository.create({
      title,
      content,
      authorId: userId,
    });

    const savedPost = await this.postRepository.save(post);

    return savedPost;
  }

  /**
   * 게시글 수정
   * @param userId 
   * @param postId 
   * @param title 
   * @param content 
   * @returns 
   */
  async updatePost(
    userId: string,
    postId: number,
    title?: string,
    content?: string,
  ) {
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다');
  
    if (post.authorId !== userId) {
      throw new BadRequestException('작성자만 수정할 수 있습니다');
    }
  
    await this.postRepository.update(postId, {
      ...(title && { title }),
      ...(content && { content }),
    });
  
    return { message: '게시글 수정 완료' };
  }
  
  /**
   * 게시글  삭제
   * @param userId 
   * @param postId 
   * @returns 
   */
  async deletePost(userId: string, postId: number) {
    console.log(`[deletePost] 시작 - userId: ${userId}, postId: ${postId}`);
    
    try {
      const post = await this.postRepository.findOne({ 
        where: { id: postId }
      });
      
      if (!post) {
        console.log(`[deletePost] 실패 - 게시글을 찾을 수 없음: postId ${postId}`);
          return {
            statusCode: 404,
            message: '게시글이 존재하지 않습니다'
          };
      }
      console.log(`[deletePost] 게시글 찾음: ${JSON.stringify(post)}`);
    
      if (post.authorId !== userId) {
        console.log(`[deletePost] 실패 - 권한 없음: post.authorId ${post.authorId}, userId ${userId}`);
        return {
          statusCode: 403,
          message: '작성자만 삭제할 수 있습니다'
        };
      }

      // 게시글 삭제 (CASCADE 옵션으로 인해 연관된 댓글과 좋아요도 자동 삭제됨)
      console.log(`[deletePost] 게시글 삭제 시작`);
      await this.postRepository.remove(post);
      console.log(`[deletePost] 게시글 삭제 완료`);
      
      return { 
        statusCode: 200,
        message: '게시글 삭제 완료' 
      };
    } catch (error) {
      console.error(`[deletePost] 삭제 중 오류 발생:`, error);
      return {
        statusCode: 500,
        message: '게시글 삭제 중 오류가 발생했습니다'
      };
    }
  }
  

  /**
   * 게시글 단건 조회
   * @param postId 
   * @returns 게시글 객체 또는 undefined
   */
  async getPostById(postId: number): Promise<any> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }

    // 작성자 정보 추가
    const userInfo = await this.getUserInfo(post.authorId);
    return {
      ...post,
      authorNickname: userInfo?.nickname || '알 수 없음',
    };
  }
  /**
   * 최신순 게시판 목록 조회 
   * @param lastPostId 
   * @returns 
   */
  async getPosts(lastPostId?: number) {
    const take = 10;
  
    let posts;
    if (lastPostId) {
      posts = await this.postRepository.find({
        where: { id: LessThan(lastPostId) },
        order: { createdAt: 'DESC' },
        take: take,
      });
    } else {
      posts = await this.postRepository.find({
        order: { createdAt: 'DESC' },
        take: take,
      });
    }

    // 각 게시글에 작성자 정보 추가
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const userInfo = await this.getUserInfo(post.authorId);
        return {
          ...post,
          authorNickname: userInfo?.nickname || '알 수 없음',
        };
      })
    );

    return postsWithUserInfo;
  }

  /**
   * 좋아요 토글
   * @param userId 
   * @param postId 
   * @returns 좋아요 상태 (true: 좋아요 추가됨, false: 좋아요 취소됨)
   */
  async toggleLike(userId: string, postId: number): Promise<boolean> {
    console.log(`[toggleLike] 시작 - userId: ${userId}, postId: ${postId}`);
    
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      console.log(`[toggleLike] 실패 - 게시글을 찾을 수 없음: postId ${postId}`);
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }
    console.log(`[toggleLike] 게시글 찾음: ${JSON.stringify(post)}`);
  
    const existing = await this.postLikeRepository.findOne({ 
      where: { 
        userId,
        post: { id: postId }
      }
    });

    if (existing) {
      // 좋아요 취소
      console.log(`[toggleLike] 좋아요 취소 - userId: ${userId}, postId: ${postId}`);
      await this.postLikeRepository.remove(existing);
      post.likesCount -= 1;
      await this.postRepository.save(post);
      console.log(`[toggleLike] 좋아요 취소 완료 - 현재 좋아요 수: ${post.likesCount}`);
      return false;
    } else {
      // 좋아요 추가
      console.log(`[toggleLike] 좋아요 추가 - userId: ${userId}, postId: ${postId}`);
      const savedLike = await this.postLikeRepository.save({ 
        userId,
        post: { id: postId }
      });
      post.likesCount += 1;
      await this.postRepository.save(post);
      console.log(`[toggleLike] 좋아요 추가 완료 - 현재 좋아요 수: ${post.likesCount}`);
      return true;
    }
  }
  
  /**
   * 인기순 게시판 목록 조회
   * @returns 
   */
  async getPopularPosts(): Promise<any[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .orderBy('(post.likesCount * 3 + post.commentsCount * 2 + post.views)', 'DESC')
      .limit(10)
      .getMany();

    // 각 게시글에 작성자 정보 추가
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const userInfo = await this.getUserInfo(post.authorId);
        return {
          ...post,
          authorNickname: userInfo?.nickname || '알 수 없음',
        };
      })
    );

    return postsWithUserInfo;
  }
  
  /**
   * 댓글 or 대댓글 작성
   * @param userId 댓글 작성자
   * @param postId 게시글 ID
   * @param content 댓글 내용
   * @param parentId 부모 댓글 ID (없으면 null)
   */
  async writeComment(
    userId: string,
    postId: number,
    content: string,
    parentId?: number,
  ) {
    console.log(`[writeComment] 시작 - userId: ${userId}, postId: ${postId}, content: ${content}, parentId: ${parentId}`);
    
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      console.log(`[writeComment] 실패 - 게시글을 찾을 수 없음: postId ${postId}`);
      throw new NotFoundException('게시글이 존재하지 않습니다');
    }
    console.log(`[writeComment] 게시글 찾음: ${JSON.stringify(post)}`);

    let level = 0;

    if (parentId) {
      const parent = await this.postCommentRepository.findOne({ 
        where: { id: parentId },
        relations: ['post']
      });
      console.log(`[writeComment] 부모 댓글 찾음: ${JSON.stringify(parent)}`);
      
      if (!parent) {
        console.log(`[writeComment] 실패 - 부모 댓글을 찾을 수 없음: parentId ${parentId}`);
        throw new NotFoundException('부모 댓글을 찾을 수 없습니다');
      }
      
      if (parent.post.id !== postId) {
        console.log(`[writeComment] 실패 - 부모 댓글이 다른 게시글에 속함: parent.post.id ${parent.post.id}, postId ${postId}`);
        throw new BadRequestException('유효하지 않은 부모 댓글입니다');
      }
      
      level = parent.level + 1;
      console.log(`[writeComment] 댓글 레벨 설정: ${level}`);
    }

    const comment = this.postCommentRepository.create({
      userId,
      content,
      post,
      parentId: parentId || null,
      level,
    });
    console.log(`[writeComment] 댓글 생성: ${JSON.stringify(comment)}`);

    const savedComment = await this.postCommentRepository.save(comment);
    console.log(`[writeComment] 댓글 저장됨: ${JSON.stringify(savedComment)}`);
    
    post.commentsCount += 1;
    const updatedPost = await this.postRepository.save(post);
    console.log(`[writeComment] 게시글 댓글 수 업데이트됨: ${updatedPost.commentsCount}`);

    return savedComment;
  }

  /**
   * 댓글 목록(계층으로 묶어 보내기)
   * @param postId 
   * @returns 
   */
  async getCommentsByPostId(postId: number) {
    const comments = await this.postCommentRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  
    // 트리로 묶기
    const commentMap = new Map<number, any>();
    const roots = [];
  
    // 모든 댓글의 작성자 정보를 한 번에 가져오기
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    const userInfoMap = new Map();
    
    await Promise.all(
      userIds.map(async (userId) => {
        const userInfo = await this.getUserInfo(userId);
        userInfoMap.set(userId, userInfo);
      })
    );
  
    for (const comment of comments) {
      const userInfo = userInfoMap.get(comment.userId);
      const node = {
        id: comment.id,
        userId: comment.userId,
        userNickname: userInfo?.nickname || '알 수 없음',
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentId: comment.parentId,
        level: comment.level,
        likesCount: comment.likesCount,
        children: [],
      };
  
      commentMap.set(comment.id, node);
  
      if (comment.parentId) {
        const parentNode = commentMap.get(comment.parentId);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          commentMap.set(comment.parentId, { children: [node] });
        }
      } else {
        roots.push(node);
      }
    }
  
    return roots;
  }

  /**
   * 댓글 삭제
   * @param userId 
   * @param commentId 
   * @returns 
   */
  async deleteComment(userId: string, commentId: number) {
    console.log(`[deleteComment] 시작 - userId: ${userId}, commentId: ${commentId}`);
    
    try {
      const comment = await this.postCommentRepository.findOne({
        where: { id: commentId },
        relations: ['post'],
      });
    
      if (!comment) {
        console.log(`[deleteComment] 실패 - 댓글을 찾을 수 없음: commentId ${commentId}`);
        return {
          statusCode: 404,
          message: '댓글이 존재하지 않습니다'
        };
      }
    
      if (comment.userId !== userId) {
        console.log(`[deleteComment] 실패 - 권한 없음: comment.userId ${comment.userId}, userId ${userId}`);
        return {
          statusCode: 403,
          message: '본인 댓글만 삭제할 수 있습니다'
        };
      }
    
      // 댓글 삭제
      console.log(`[deleteComment] 댓글 삭제 시작`);
      await this.postCommentRepository.remove(comment);
      console.log(`[deleteComment] 댓글 삭제 완료`);
    
      // 게시글의 댓글 수 업데이트
      const post = comment.post;
      post.commentsCount -= 1;
      await this.postRepository.save(post);
      console.log(`[deleteComment] 게시글 댓글 수 업데이트 완료: ${post.commentsCount}`);
    
      return { 
        statusCode: 200,
        message: '댓글 삭제 완료' 
      };
    } catch (error) {
      console.error(`[deleteComment] 삭제 중 오류 발생:`, error);
      return {
        statusCode: 500,
        message: '댓글 삭제 중 오류가 발생했습니다'
      };
    }
  }
  
  /**
   * 댓글 좋아요 토글
   * @param userId 
   * @param commentId 
   * @returns 좋아요 상태 (true: 좋아요 추가됨, false: 좋아요 취소됨)
   */
  async toggleCommentLike(userId: string, commentId: number): Promise<boolean> {
    console.log(`[toggleCommentLike] 시작 - userId: ${userId}, commentId: ${commentId}`);
    
    const comment = await this.postCommentRepository.findOne({ 
      where: { id: commentId }
    });
    if (!comment) {
      console.log(`[toggleCommentLike] 실패 - 댓글을 찾을 수 없음: commentId ${commentId}`);
      throw new NotFoundException('댓글을 찾을 수 없습니다');
    }
    console.log(`[toggleCommentLike] 댓글 찾음: ${JSON.stringify(comment)}`);
  
    const existing = await this.commentLikeRepository.findOne({ 
      where: { 
        userId,
        comment: { id: commentId }
      }
    });

    if (existing) {
      // 좋아요 취소
      console.log(`[toggleCommentLike] 좋아요 취소 - userId: ${userId}, commentId: ${commentId}`);
      await this.commentLikeRepository.remove(existing);
      comment.likesCount -= 1;
      await this.postCommentRepository.save(comment);
      console.log(`[toggleCommentLike] 좋아요 취소 완료 - 현재 좋아요 수: ${comment.likesCount}`);
      return false;
    } else {
      // 좋아요 추가
      console.log(`[toggleCommentLike] 좋아요 추가 - userId: ${userId}, commentId: ${commentId}`);
      const savedLike = await this.commentLikeRepository.save({ 
        userId,
        comment: { id: commentId }
      });
      comment.likesCount += 1;
      await this.postCommentRepository.save(comment);
      console.log(`[toggleCommentLike] 좋아요 추가 완료 - 현재 좋아요 수: ${comment.likesCount}`);
      return true;
    }
  }
  
  /**
   * 댓글 좋아요 여부 확인
   * @param userId 
   * @param commentId 
   * @returns 
   */
  async hasLikedComment(userId: string, commentId: number): Promise<boolean> {
    console.log(`[hasLikedComment] 시작 - userId: ${userId}, commentId: ${commentId}`);
    
    const comment = await this.postCommentRepository.findOne({ 
      where: { id: commentId }
    });
    if (!comment) {
      console.log(`[hasLikedComment] 실패 - 댓글을 찾을 수 없음: commentId ${commentId}`);
      throw new NotFoundException('댓글을 찾을 수 없습니다');
    }
    console.log(`[hasLikedComment] 댓글 찾음: ${JSON.stringify(comment)}`);
  
    const existing = await this.commentLikeRepository.findOne({ 
      where: { 
        userId,
        comment: { id: commentId }
      }
    });
    console.log(`[hasLikedComment] 좋아요 여부: ${!!existing}`);
    return !!existing;
  }
  
  /**
   * 좋아요 여부 확인
   * @param userId 
   * @param postId 
   * @returns 
   */
  async hasLiked(userId: string, postId: number): Promise<boolean> {
    console.log(`[hasLiked] 시작 - userId: ${userId}, postId: ${postId}`);
    
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      console.log(`[hasLiked] 실패 - 게시글을 찾을 수 없음: postId ${postId}`);
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }
    console.log(`[hasLiked] 게시글 찾음: ${JSON.stringify(post)}`);
  
    const existing = await this.postLikeRepository.findOne({ 
      where: { 
        userId,
        post: { id: postId }
      }
    });
    console.log(`[hasLiked] 좋아요 여부: ${!!existing}`);
    return !!existing;
  }

  async getUserInfo(userId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'getUser' }, { id: userId })
    );
  }
}