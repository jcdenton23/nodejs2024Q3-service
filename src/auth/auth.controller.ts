import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';
import { LoginDto, SignupDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async handleSignup(@Body() signupData: SignupDto) {
    this.loggingService.log(`Attempting signup for user: ${signupData.login}`);
    const result = await this.authService.signup(signupData);
    this.loggingService.log(`Signup successful for user: ${signupData.login}`);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Body() loginData: LoginDto) {
    const { login } = loginData;
    this.loggingService.log(`Login attempt for user: ${login}`);
    const authToken = await this.authService.login(loginData);
    this.loggingService.log(`User logged in successfully: ${login}`);
    return authToken;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async handleTokenRefresh(@Body('refreshToken') token: string) {
    if (!token) {
      this.loggingService.warn(
        'Failed refresh attempt: No refresh token provided',
      );
      throw new UnauthorizedException('Refresh token is required');
    }
    this.loggingService.log(`Processing refresh token: ${token}`);
    return this.authService.refresh(token);
  }
}
