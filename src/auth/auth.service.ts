import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/dtos/user/create-user.dto';
import { UserResponseDto } from 'src/dtos/user/user-response.dto';
import { User } from 'src/entities/user/user.entity';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ApplicationClientConfig } from 'src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly data_source: DataSource,
    private readonly jwt_service: JwtService,
    private readonly appConfig: ApplicationClientConfig,
  ) {}

  async profile(user_id: string): Promise<UserResponseDto> {
    const user = await this.data_source.getRepository(User).findOne({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== user_id) {
      throw new NotFoundException('FUCCCK YOU NIGGA!!!!!');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async signup(input: CreateUserDto): Promise<UserResponseDto> {
    return await this.data_source.transaction(async (manager) => {
      const hashed_password = await bcrypt.hash(input.password, 10);
      const email = await manager.findOne(User, {
        where: {
          email: input.email,
        },
      });

      if (email) {
        throw new ConflictException('Email already exists');
      }

      const user = manager.create(User, {
        ...input,
        password: hashed_password,
      });

      const tokens = await this.generate_tokens(user);
      user.access_token = tokens.access_token;
      user.refresh_token = tokens.refresh_token;

      const epoch = Math.floor(Date.now() / 1000);
      user.created_at = epoch;
      user.updated_at = epoch;

      return plainToInstance(UserResponseDto, await manager.save(User, user), {
        excludeExtraneousValues: true,
      });
    });
  }

  async login(input: LoginUserDto): Promise<UserResponseDto> {
    const user = await this.data_source
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {
        email: input.email,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(input.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generate_tokens(user);

    user.access_token = tokens.access_token;

    user.refresh_token = tokens.refresh_token;

    await this.data_source.getRepository(User).save(user);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async generate_tokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwt_service.signAsync(payload, {
      expiresIn: this.appConfig.jwt_expire_access,
    });

    const refresh_token = await this.jwt_service.signAsync(payload, {
      expiresIn: this.appConfig.jwt_expire_refresh,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
