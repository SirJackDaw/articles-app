import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtPayload } from 'src/types/jwtPayload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: CreateUserDto) {
    return this.userService.createUser(dto)
  }

  async login(dto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.userService.validateUser(dto.email, dto.password)
    const tokens = this.getTokens({ id: user.id, username: user.name, email: user.email })
    return tokens
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') });
    const { id, username, email } = payload

    const oldRefreshToken = await this.cacheManager.get<string>(payload.id)
    if (!oldRefreshToken || refreshToken !== oldRefreshToken) throw new UnauthorizedException('token error')

    const tokens = this.getTokens({ id, username, email })
    return tokens;
  }

  async logout(userId: string) {
    this.cacheManager.del(userId)
  }

  private async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: +this.configService.get<string>('ACCESS_EXPIRY_IN_SECONDS'),
        },
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: +this.configService.get<string>('REFRESH_EXPIRY_IN_SECONDS'),
        },
      ),
    ]);

    this.cacheManager.set(payload.id, refreshToken, { ttl: +this.configService.get<string>('REFRESH_EXPIRY_IN_SECONDS') } as any)

    return {
      accessToken,
      refreshToken,
    };
  }
}
