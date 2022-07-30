export interface PayloadToken {
  role: string;
  sub: number;
}
export interface RefreshToken {
  email: string;
}

export interface CookieFields {
  role: string;
  sub: number;
  email: string;
  refreshToken: string;
  iat?: number;
  exp?: number;
}
