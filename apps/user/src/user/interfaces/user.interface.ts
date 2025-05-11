// user.interface.ts
export interface CreateNicknameRequest {
  userId: string;
  nickname: string;
}

export interface CreateNicknameResponse {
  nickname: string;
}
