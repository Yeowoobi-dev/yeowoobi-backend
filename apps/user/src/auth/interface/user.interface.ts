// apps/gateway/src/auth/interfaces/user.interface.ts
import { Observable } from 'rxjs';

export interface FindBySocialIdRequest {
  socialId: string;
  socialType: string;
}

export interface CreateUserRequest {
  socialId: string;
  email: string;
  name: string;
  socialType: string;
}

export interface User {
  id: string;
  socialId: string;
  email: string;
  name: string;
  socialType: string;
  nickname?: string;
  introduce?: string;
}

export interface UserServiceClient {
  findBySocialId(request: FindBySocialIdRequest): Observable<User>;
  createUser(request: CreateUserRequest): Observable<User>;
}