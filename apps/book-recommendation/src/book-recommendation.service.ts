import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BookRecommendationService {
  private readonly openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async recommendBookWithSearch(userAnswers: string[]) {
    const inputPrompt = `
당신은 감정 기반 책 추천 전문가입니다.

[질문 리스트]
1. 요즘 가장 자주 드는 생각은 무엇인가요?
2 지금 당신의 마음을 색으로 표현한다면?
3. 타인이 나를 기억하길 바라는 모습은?
4. 최근 가장 강하게 느낀 감정은 무엇인가요?
5. '변화'에 대해 어떤 생각을 하시나요?
6. 과거의 나에게 한마디 한다면?
7. 부러운 사람의 모습은 어떤가요?
8. 혼자있을때 주로 하는 일은?

[사용자 응답]
${userAnswers.join(", ")}

[수행할 작업]
1. 응답을 바탕으로 사용자의 감정과 사고 상태를 상담사처럼 3~5줄 요약으로 분석
2. GPT 지식에서 리뷰 수 1000개 이상인 도서를 1권 추천 (2023년 이전도 허용)
3. 2024년 이후 출간된 유사한 책을 웹 검색을 통해 하나 더 추천 (리뷰 수 1000개 이상)
4. 두 책 중 감정에 더 적합한 책 1권을 선택
5. 사용자의 심리 상태에 어울리게 반말을 사용해서 캐릭터가 말하듯 구어체로 따뜻하게 추천 멘트를 작성 (300자 이상)
6. 아래 JSON 형식으로 반환

{
  "title": "책 제목",
  "author": "저자 이름",
  "description": "책 요약",
  "ment": "사용자 감정에 기반한 300자 이상의 따뜻한 추천 멘트"
}

※ 절대로 JSON 외의 텍스트를 출력하지 마. JSON 객체만 정확히 출력해.
※ 마크다운, 설명 문장, 해석 문장, 백틱 코드 블록도 사용하지 마.
`;

    try {
      const response = await this.openai.responses.create({
        model: "gpt-4.1",
        input: inputPrompt,
        tools: [{ type: "web_search_preview" }],
      });
      console.log(response);
      // ❗ 올바른 필드: content
      const raw = response.output_text
      console.log(raw);
      if (!raw) {
        throw new Error('GPT 응답이 비어 있습니다.');
      }

      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');
      const jsonString = raw.slice(jsonStart, jsonEnd + 1);

      //////////////////////
      const parsed = JSON.parse(jsonString);

      const query = `${parsed.title} ${parsed.author}`
      const books = await this.searchBooks(query);

      const matched = books.items.find(item => {
        const cleanTitle = item.title.replace(/<[^>]*>/g, '');
        const cleanAuthor = item.author.replace(/<[^>]*>/g, '');
        return cleanTitle.includes(parsed.title) && cleanAuthor.includes(parsed.author);
      }) || books.items[0]; 
  
      parsed.image = matched?.image || null;
      parsed.publisher = matched?.publisher || null;
      //////////////////////
      try {
        return {
          title: parsed.title,
          author: parsed.author,
          image: matched?.image || null,
          publisher: matched?.publisher || null,
          description: parsed.description,
          ment: parsed.ment,
        };
      } catch (parseError) {
        throw new Error('응답을 JSON으로 파싱할 수 없습니다.');
      }
    } catch (error) {
      throw new Error(`책 추천 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  /** 
   * 네이버 도서 검색 api service
   * @param query 
   * @param display 
   * @param start 
   * @returns 
   */
  async searchBooks(query: string, display: number = 1, start: number = 1) {
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
}
