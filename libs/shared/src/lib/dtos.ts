export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
    username: string;
} & LoginDto;

export type JwtDto = {
  access_token: string;
  refresh_token: string;
}

export type JwtPayload = {
  sub: string;
  exp: number;
  iat: number;
};

export type UserDto = {
  id: string;
  username: string;
  email: string;
}
