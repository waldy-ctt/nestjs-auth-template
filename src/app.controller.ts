import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  async login(@Request() req) {
    // In reality, use @Body() DTO here
    return this.authService.login(req.body);
  }

  // Protected Route (The Money Maker)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Returns the data from JwtStrategy.validate()
  }
}
