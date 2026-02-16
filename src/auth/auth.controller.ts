import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDataDto } from './dto/register-data.dto';
import { LoginDataDto } from './dto/login-data.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // 201 Created
  async register(@Body() data: RegisterDataDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // 200 OK (Overrides NestJS default 201)
  async login(@Body() data: LoginDataDto) {
    return this.authService.login(data);
  }

  // The 'jwt-refresh' string matches the name in jwt-refresh.strategy.ts
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    const refreshToken = req.user.refreshToken;

    // We pass the raw token to the service so it can be hashed and compared to the DB
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
