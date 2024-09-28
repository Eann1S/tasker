import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../../libs/shared/src';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserServiceAdapter } from './user-service.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_EXP_TIME, JWT_SECRET } from '../constants/auth.constants';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get(JWT_SECRET),
          signOptions: { expiresIn: config.get(JWT_EXP_TIME) },
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['./apps/auth-service/.env'],
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
    ]),
  ],
  controllers: [AuthServiceController],
  providers: [AuthService, JwtStrategy, UserServiceAdapter],
  exports: [AuthService],
})
export class AuthServiceModule {}
