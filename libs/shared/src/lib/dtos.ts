export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
    username: string;
} & LoginDto;

export type JwtDto = {
  token: string;
}

export type UserDto = {
  id: number;
  username: string;
  email: string;
}
