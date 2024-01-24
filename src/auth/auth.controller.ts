import { Controller, Post,Get, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { JwtPayload } from 'src/types/jwtPayload';
import { TokensResponse } from './dto/tokensResponse.dto';
import { Refresh } from './dto/refresh.dto';

@ApiBearerAuth()
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto})
  createUser(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto)
  }

  @Post('login')
  @ApiBody({ type: LoginDto})
  @ApiResponse({ status: 200, description: 'Login success', type: TokensResponse})
  async login(@Body() dto: LoginDto){
    return this.authService.login(dto)
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiResponse({ status: 200, description: 'logout success' })
  @ApiUnauthorizedResponse()
  async logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.id)
  }

  @Post('refresh')
  @ApiBody({ type: Refresh })
  @ApiResponse({ status: 200, description: 'Refresh success', type: TokensResponse })
  async refresh(@Body() token: { token: string }) {
    return this.authService.refreshToken(token.token)
  }
}