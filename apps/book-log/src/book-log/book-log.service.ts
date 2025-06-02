import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { BookLog } from './entity/book-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveBookLogDto } from './dto/book-log.dto';
import { CreateBookLogDto } from './dto/create-book-log.dto';
import { UpdateBookLogDto } from './dto/update-book-log.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LogComment } from './entity/log-comment.entity';
import { CreateLogCommentDto } from './dto/create-log-comment.dto';
import { LogCommentLike } from './entity/log-comment-like.entity';
import { BookLogLike } from './entity/book-log-like.entity';
import { ClientProxy } from '@nestjs/microservices';
import { In } from 'typeorm';

@Injectable()
export class BookLogService {
  constructor(
    @InjectRepository(BookLog)
    private bookLogRepository: Repository<BookLog>,
    @InjectRepository(LogComment)
    private logCommentRepository: Repository<LogComment>,
    @InjectRepository(LogCommentLike)
    private logCommentLikeRepository: Repository<LogCommentLike>,
    @InjectRepository(BookLogLike)
    private bookLogLikeRepository: Repository<BookLogLike>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private readonly baseUrl: string = 'https://openapi.naver.com/v1/search/book.json';

  async createBookLog(createBookLogDto: {
    userId: string;
    logTitle: string;
    text: string;
    review: string;
    background: string;
    bookTitle: string;
    bookImage: string;
    author: string;
    publisher: string;
    visibility: 'public' | 'private' | 'followers';
  }) {
    console.log("createBookLogDto::::::::::::::", createBookLogDto);
    const bookLog = this.bookLogRepository.create(createBookLogDto);
    console.log("bookLog::::::::::::::", bookLog);
    return await this.bookLogRepository.save(bookLog);
  }

  async getBookLog(userId: string) {
    try {
      const bookLogs = await this.bookLogRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      // 각 북로그에 대해 좋아요 여부와 작성자 정보 확인
      const bookLogsWithLikeStatus = await Promise.all(
        bookLogs.map(async (bookLog) => {
          try {
            const [isLiked, userInfo] = await Promise.all([
              this.hasLikedBookLog(userId, bookLog.id),
              this.getUserInfo(bookLog.userId)
            ]);
            return {
              ...bookLog,
              isLiked,
              userNickname: userInfo?.nickname || '알 수 없음'
            };
          } catch (error) {
            console.error(`Error processing book log ${bookLog.id}:`, error);
            return {
              ...bookLog,
              isLiked: false,
              userNickname: '알 수 없음'
            };
          }
        })
      );

      return bookLogsWithLikeStatus;
    } catch (error) {
      console.error('Error in getBookLog:', error);
      throw error;
    }
  }

  async getBookLogList(userId: string) {
    try {
      const bookLogs = await this.bookLogRepository.find({ 
        order: { createdAt: 'DESC' }
      });

      // 각 북로그에 대해 좋아요 여부와 작성자 정보 확인
      const bookLogsWithLikeStatus = await Promise.all(
        bookLogs.map(async (bookLog) => {
          try {
            const [isLiked, userInfo] = await Promise.all([
              this.hasLikedBookLog(userId, bookLog.id),
              this.getUserInfo(bookLog.userId)  // 각 북로그의 작성자 정보 조회
            ]);
            return {
              ...bookLog,
              isLiked,
              userNickname: userInfo?.nickname || '알 수 없음'
            };
          } catch (error) {
            console.error(`Error processing book log ${bookLog.id}:`, error);
            return {
              ...bookLog,
              isLiked: false,
              userNickname: '알 수 없음'
            };
          }
        })
      );

      return bookLogsWithLikeStatus;
    } catch (error) {
      console.error('Error in getBookLogList:', error);
      throw error;
    }
  }

  async hasLikedBookLog(userId: string, bookLogId: number): Promise<boolean> {
    const existingLike = await this.bookLogLikeRepository.findOne({
      where: { 
        userId,
        bookLog: { id: bookLogId }
      }
    });
    return !!existingLike;
  }

  /** 외부 api라서 나중에 따로 서비스 뺄지 고민
   * 네이버 도서 검색 api service
   * @param query 
   * @param display 
   * @param start 
   * @returns 
   */
  async searchBooks(query: string, display: number = 10, start: number = 1) {
    console.log('Searching books with params:', { query, display, start });
    
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('NAVER_SECRET');
    
    console.log('Using credentials:', { 
      clientId: clientId ? 'set' : 'not set', 
      clientSecret: clientSecret ? 'set' : 'not set',
      actualClientId: clientId,
      actualClientSecret: clientSecret
    });
    
    const headers = {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    };
    
    console.log('Request headers:', headers);
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}`,
          { headers }
        ),
      );
      
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw error;
    }
  }

  async findBookLogs(userId: string) {
    return await this.bookLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async createComment(userId: string, createLogCommentDto: CreateLogCommentDto) {
    const bookLog = await this.bookLogRepository.findOne({
      where: { id: createLogCommentDto.bookLogId }
    });

    if (!bookLog) {
      throw new NotFoundException('북로그를 찾을 수 없습니다.');
    }

    const comment = this.logCommentRepository.create({
      ...createLogCommentDto,
      userId,
      level: createLogCommentDto.parentId ? 1 : 0,
      bookLog: { id: bookLog.id }
    });

    const savedComment = await this.logCommentRepository.save(comment);
    
    // 댓글 개수 증가
    bookLog.commentsCount += 1;
    await this.bookLogRepository.save(bookLog);

    return savedComment;
  }

// ... existing code ...
  async getUserInfo(userId: string) {
    console.log('Getting user info for userId:', userId);
    try {
      console.log('Sending request to user service...');
      const userInfo = await firstValueFrom(
        this.userClient.send({ cmd: 'getUser' }, { id: userId })
      );
      console.log('Received user info:', userInfo);
      return userInfo;
    } catch (error) {
      console.error('Error details:', {
        error,
        message: error.message,
        stack: error.stack,
        userId
      });
      return { nickname: '알 수 없음' };
    }
  }
// ... existing code ...
  async getComments(bookLogId: number, userId?: string) {
    const comments = await this.logCommentRepository.find({
      where: { bookLog: { id: bookLogId } },
      order: {
        createdAt: 'DESC',
        level: 'ASC'
      }
    });

    // 최상위 댓글만 필터링
    const rootComments = comments.filter(comment => comment.level === 0);
    
    // 모든 댓글의 userId를 수집
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    
    // 사용자 정보를 한 번에 가져오기
    const userInfos = await Promise.all(
      userIds.map(userId => this.getUserInfo(userId))
    );
    const userInfoMap = new Map(
      userInfos.map((info, index) => [userIds[index], info])
    );

    // 좋아요 상태를 한 번에 가져오기
    let likesMap = new Map();
    if (userId) {
      try {
        const likes = await this.logCommentLikeRepository.find({
          where: { 
            userId,
            comment: { id: In(comments.map(c => c.id)) }
          },
          relations: ['comment']  // comment 관계 추가
        });
        likesMap = new Map(likes.map(like => [like.comment?.id, true]));
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    }

    // 각 최상위 댓글에 대댓글 매핑
    const commentsWithReplies = rootComments.map(rootComment => {
      const replies = comments.filter(
        comment => comment.parentId === rootComment.id
      );

      return {
        ...rootComment,
        userNickname: userInfoMap.get(rootComment.userId)?.nickname || '알 수 없음',
        isLiked: likesMap.get(rootComment.id) || false,
        replies: replies.map(reply => ({
          ...reply,
          userNickname: userInfoMap.get(reply.userId)?.nickname || '알 수 없음',
          isLiked: likesMap.get(reply.id) || false
        }))
      };
    });

    return commentsWithReplies;
  }

  async hasLikedComment(userId: string, commentId: number): Promise<boolean> {
    const existingLike = await this.logCommentLikeRepository.findOne({
      where: { 
        userId,
        comment: { id: commentId }
      }
    });
    return !!existingLike;
  }

  async deleteComment(userId: string, commentId: number) {
    const comment = await this.logCommentRepository.findOne({
      where: { id: commentId, userId },
      relations: ['bookLog']
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없거나 삭제 권한이 없습니다.');
    }

    await this.logCommentRepository.remove(comment);

    // 댓글 개수 감소
    const bookLog = await this.bookLogRepository.findOne({
      where: { id: comment.bookLog.id }
    });
    if (bookLog) {
      bookLog.commentsCount = Math.max(0, bookLog.commentsCount - 1);
      await this.bookLogRepository.save(bookLog);
    }

    return { message: '댓글이 삭제되었습니다.' };
  }

  async toggleCommentLike(userId: string, commentId: number) {
    const comment = await this.logCommentRepository.findOne({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const existingLike = await this.logCommentLikeRepository.findOne({
      where: { userId, comment: { id: commentId } }
    });

    if (existingLike) {
      // 좋아요 취소
      await this.logCommentLikeRepository.remove(existingLike);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      await this.logCommentRepository.save(comment);
      return { 
        liked: false, 
        likesCount: comment.likesCount,
        isLiked: false
      };
    } else {
      // 좋아요 추가
      const like = this.logCommentLikeRepository.create({
        userId,
        comment
      });
      await this.logCommentLikeRepository.save(like);
      comment.likesCount += 1;
      await this.logCommentRepository.save(comment);
      return { 
        liked: true, 
        likesCount: comment.likesCount,
        isLiked: true
      };
    }
  }

  async getCommentLikes(commentId: number) {
    const likes = await this.logCommentLikeRepository.find({
      where: { comment: { id: commentId } }
    });
    return likes;
  }

  async toggleBookLogLike(userId: string, bookLogId: number) {
    const bookLog = await this.bookLogRepository.findOne({
      where: { id: bookLogId }
    });

    if (!bookLog) {
      throw new NotFoundException('북로그를 찾을 수 없습니다.');
    }

    const existingLike = await this.bookLogLikeRepository.findOne({
      where: { userId, bookLog: { id: bookLogId } }
    });

    if (existingLike) {
      // 좋아요 취소
      await this.bookLogLikeRepository.remove(existingLike);
      bookLog.likesCount = Math.max(0, bookLog.likesCount - 1);
      await this.bookLogRepository.save(bookLog);
      return { 
        liked: false, 
        likesCount: bookLog.likesCount,
        isLiked: false
      };
    } else {
      // 좋아요 추가
      const like = this.bookLogLikeRepository.create({
        userId,
        bookLog
      });
      await this.bookLogLikeRepository.save(like);
      bookLog.likesCount += 1;
      await this.bookLogRepository.save(bookLog);
      return { 
        liked: true, 
        likesCount: bookLog.likesCount,
        isLiked: true
      };
    }
  }

  async getBookLogLikes(bookLogId: number) {
    const likes = await this.bookLogLikeRepository.find({
      where: { bookLog: { id: bookLogId } }
    });
    return likes;
  }

  async saveBookInfo(userId: string, bookLog: any) {
    const bookLogEntity = this.bookLogRepository.create({
      userId,
      logTitle: bookLog.title,
      text: bookLog.content,
      review: bookLog.review,
      background: bookLog.background,
      bookTitle: bookLog.bookTitle,
      bookImage: bookLog.bookImage,
      author: bookLog.author,
      publisher: bookLog.publisher,
      visibility: 'public' as const
    });

    return await this.bookLogRepository.save(bookLogEntity);
  }

  async deleteBookLog(userId: string, bookLogId: number) {
    const bookLog = await this.bookLogRepository.findOne({
      where: { id: bookLogId, userId }
    });

    if (!bookLog) {
      throw new NotFoundException('북로그를 찾을 수 없거나 삭제 권한이 없습니다.');
    }

    // 관련된 댓글과 좋아요 삭제
    await Promise.all([
      this.logCommentRepository.delete({ bookLog: { id: bookLogId } }),
      this.bookLogLikeRepository.delete({ bookLog: { id: bookLogId } })
    ]);

    // 북로그 삭제
    await this.bookLogRepository.remove(bookLog);

    return { message: '북로그가 삭제되었습니다.' };
  }

  async updateBookLog(userId: string, bookLogId: number, updateData: {
    logTitle: string;
    text: string;
    background: string;
    review: string;
    bookTitle: string;
    author: string;
    publisher: string;
  }) {
    const bookLog = await this.bookLogRepository.findOne({
      where: { id: bookLogId, userId }
    });

    if (!bookLog) {
      throw new NotFoundException('북로그를 찾을 수 없거나 수정 권한이 없습니다.');
    }

    // 업데이트할 필드만 수정
    Object.assign(bookLog, updateData);
    
    return await this.bookLogRepository.save(bookLog);
  }
}
