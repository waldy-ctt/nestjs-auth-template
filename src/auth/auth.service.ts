/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDataDto } from './dto/register-data.dto';
import { LoginDataDto } from './dto/login-data.dto';

// 1. Strict Return Type for Tokens
export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDataDto): Promise<Tokens> {
    // [STUB] DB Check: if (userExists) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(data.password);

    // [STUB] DB Save: const newUser = await this.userRepository.save({ ...data, password: hashedPassword });
    const mockUserId = 'uuid-new-user-123';

    const tokens = await this.getTokens(mockUserId, data.username);
    await this.updateRefreshTokenHash(mockUserId, tokens.refresh_token);

    return tokens;
  }

  async login(data: LoginDataDto): Promise<Tokens> {
    // [STUB] DB Fetch: const user = await this.userRepository.findByUsername(data.username);

    // Simulating a DB user for the boilerplate
    const mockStoredUser = {
      id: 'uuid-existing-user-123',
      username: 'admin',
      password: await this.hashData('password123'),
    };

    if (!mockStoredUser) {
      throw new UnauthorizedException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      mockStoredUser.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(
      mockStoredUser.id,
      mockStoredUser.username,
    );
    await this.updateRefreshTokenHash(mockStoredUser.id, tokens.refresh_token);

    return tokens;
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    // [STUB] DB Fetch: const user = await this.userRepository.findById(userId);
    const mockUser = {
      id: userId,
      username: 'admin',
      hashedRt: 'mock_hashed_rt_from_db',
    };

    if (!mockUser || !mockUser.hashedRt) {
      throw new UnauthorizedException('Access Denied');
    }

    // [STUB] Compare the raw token (rt) with the hashed token in the DB
    // const rtMatches = await bcrypt.compare(rt, mockUser.hashedRt);
    const rtMatches = true; // Simulating a match for boilerplate

    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(mockUser.id, mockUser.username);
    await this.updateRefreshTokenHash(mockUser.id, tokens.refresh_token);

    return tokens;
  }

  // --- Core Utility Methods ---

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  private async getTokens(userId: string, username: string): Promise<Tokens> {
    const payload = { sub: userId, username };

    // 2. High-Performance Parallel Token Generation
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        // Bypass jsonwebtoken's strict StringValue type constraint for env variables
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as any,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  private async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await this.hashData(refreshToken);
    // [STUB] DB Update: await this.userRepository.update(userId, { hashedRt: hash });
  }
}
