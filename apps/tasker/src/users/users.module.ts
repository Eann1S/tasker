import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../../../../libs/shared/src';

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
