import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../../libs/shared/src';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP_TIME },
    }),
  ],
  controllers: [AuthServiceController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthServiceModule {}
