import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostLike } from './entity/post-like.entity';
import { PostComment } from './entity/post-comment.entity';
import { CommentLike } from './entity/comment-like.entity';

@Injectable()
export class FreeCommunityService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly commentLikeRepository: Repository<CommentLike>,
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
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다');
  
    if (post.authorId !== userId) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다');
    }
  
    await this.postRepository.remove(post);
  
    return { message: '게시글 삭제 완료' };
  }
  

  /**
   * 게시글 단건 조회
   * @param postId 
   * @returns 게시글 객체 또는 undefined
   */
  async getPostById(postId: number): Promise<Post | undefined> {
    return await this.postRepository.findOne({
      where: { id: postId },
    });
  }
  /**
   * 최신순 게시판 목록 조회 
   * @param lastPostId 
   * @returns 
   */
  async getPosts(lastPostId?: number) {
    const take = 10; // 한 번에 가져올 개수
  
    if (lastPostId) {
      return await this.postRepository.find({
        where: { id: LessThan(lastPostId) },
        order: { createdAt: 'DESC' },
        take: take,
      });
    }
  
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
      take: take,
    });
  }

  /**
   * 인기순 게시판 목록 조회
   * @returns 
   */
  async getPopularPosts(): Promise<Post[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .orderBy('(post.likesCount * 3 + post.commentsCount * 2 + post.views)', 'DESC')
      .limit(10)
      .getMany();
  }
  
  /**
   * 좋아요 기능
   * @param userId 
   * @param postId 
   */
  async likePost(userId: string, postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }
  
    const existing = await this.postLikeRepository.findOne({ where: { userId, post }});
    if (existing) {
      throw new BadRequestException('이미 좋아요를 눌렀습니다');
    }
  
    await this.postLikeRepository.save({ userId, post });
    await this.postRepository.update(postId, {
      likesCount: () => 'likes_count + 1',
    });
  }
  
  /**
   * 좋아요 취소
   * @param userId 
   * @param postId 
   */
  async unlikePost(userId: string, postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }
  
    const existing = await this.postLikeRepository.findOne({ where: { userId, post }});
    if (!existing) {
      throw new NotFoundException('좋아요한 적이 없습니다');
    }
  
    await this.postLikeRepository.remove(existing);
    await this.postRepository.update(postId, {
      likesCount: () => 'likes_count - 1',
    });
  }
  
  /**
   * 좋아요 여부 확인
   * @param userId 
   * @param postId 
   * @returns 
   */
  async hasLiked(userId: string, postId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }
  
    const existing = await this.postLikeRepository.findOne({ where: { userId, post }});
    return !!existing;
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
    const post = await this.postRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('게시글이 존재하지 않습니다');
    }

    let level = 0;

    if (parentId) {
      const parent = await this.postCommentRepository.findOne({ where: { id: parentId }});
      if (!parent || parent.post.id !== postId) {
        throw new BadRequestException('유효하지 않은 부모 댓글입니다');
      }
      level = parent.level + 1;
    }

    const comment = this.postCommentRepository.create({
      userId,
      content,
      post,
      parentId: parentId || null,
      level,
    });

    await this.postCommentRepository.save(comment);
    await this.postRepository.update(postId, {
      commentsCount: () => 'comments_count + 1',
    });

    return comment;
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
  
    for (const comment of comments) {
      const node = {
        id: comment.id,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentId: comment.parentId,
        level: comment.level,
        children: [],
      };
  
      commentMap.set(comment.id, node);
  
      if (comment.parentId) {
        const parentNode = commentMap.get(comment.parentId);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          // 혹시 부모가 순서상 아직 안 만들어졌다면 나중에 묶임
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
    const comment = await this.postCommentRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });
  
    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }
  
    if (comment.userId !== userId) {
      throw new BadRequestException('본인 댓글만 삭제할 수 있습니다');
    }
  
    await this.postCommentRepository.remove(comment);
  
    await this.postRepository.update(comment.post.id, {
      commentsCount: () => 'comments_count - 1',
    });
  
    return { message: '댓글 삭제 완료' };
  }
  
  /**
   * 댓글 좋아요 추가
   * @param userId 
   * @param commentId 
   */
  async likeComment(userId: string, commentId: number) {
    const comment = await this.postCommentRepository.findOne({ where: { id: commentId }});
    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }
  
    const existing = await this.commentLikeRepository.findOne({ where: { userId, comment }});
    if (existing) {
      throw new BadRequestException('이미 좋아요를 누른 댓글입니다');
    }
  
    await this.commentLikeRepository.save({ userId, comment });
    await this.postCommentRepository.update(commentId, {
      likesCount: () => 'likes_count + 1',
    });
  }
  
  /**
   * 댓글 좋아요 취소
   * @param userId 
   * @param commentId 
   */
  async unlikeComment(userId: string, commentId: number) {
    const comment = await this.postCommentRepository.findOne({ where: { id: commentId }});
    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }
  
    const existing = await this.commentLikeRepository.findOne({ where: { userId, comment }});
    if (!existing) {
      throw new NotFoundException('좋아요한 적이 없습니다');
    }
  
    await this.commentLikeRepository.remove(existing);
    await this.postCommentRepository.update(commentId, {
      likesCount: () => 'likes_count - 1',
    });
  }

  /**
   * 댓글 좋아요 여부 확인
   * @param userId 
   * @param commentId 
   * @returns 
   */
  async hasLikedComment(userId: string, commentId: number): Promise<boolean> {
    const comment = await this.postCommentRepository.findOne({ where: { id: commentId }});
    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }
  
    const existing = await this.commentLikeRepository.findOne({ where: { userId, comment }});
    return !!existing;
  }
  
}
