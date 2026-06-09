import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationClientConfig } from 'src/config/app.config';
import { User } from 'src/entities/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.straregy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ApplicationClientConfig],
      useFactory: (config: ApplicationClientConfig) => ({
        secret: config.secret,
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
