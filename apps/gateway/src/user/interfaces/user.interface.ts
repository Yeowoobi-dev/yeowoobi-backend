import { Observable } from 'rxjs';

export interface FindBySocialIdRequest {
  social_id: string;
  social_type: string;
}

export interface CreateUserRequest {
  social_id: string;
  email: string;
  name: string;
  social_type: string;
}

export interface CreateNicknameRequest {
  userId: string;
  nickname: string;
}

export interface CreateNicknameResponse {
  nickname: string;
}

export interface CreateIntroduceRequest {
  userId: string;
  introduce: string;
} 

export interface SaveInterestsRequest {
  userId: string;
  interestNames: string[];
} 

export interface FindInterestsRequest {
  userId: string;
}

export interface UserResponse {
  id: string;
  social_id: string;
  email: string;
  name: string;
  social_type: string;
  nickname?: string;
  introduce?: string;
}

export interface UserServiceClient {
  findBySocialId(request: FindBySocialIdRequest): Observable<UserResponse>;
  createUser(request: CreateUserRequest): Observable<UserResponse>;
  createNickname(request: CreateNicknameRequest): Observable<CreateNicknameResponse>;
  createIntroduce(request: CreateIntroduceRequest): Observable<UserResponse>;
  saveInterests(request: SaveInterestsRequest): Observable<UserResponse>; 
  findInterests(request: FindInterestsRequest): Observable<UserResponse>;
} 