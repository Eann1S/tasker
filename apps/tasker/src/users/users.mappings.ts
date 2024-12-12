import { User } from '@prisma/client';
import { UserDto } from '@tasker/shared';

export function mapUserToDto(user: User): UserDto {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
