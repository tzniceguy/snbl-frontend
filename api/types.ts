// types.ts
export interface UserTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  tokens: UserTokens;
}

export interface AuthResponse {
  user: User;
}
