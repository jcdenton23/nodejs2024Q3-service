import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignupDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly jwtSecretRefreshKey: string;
  private readonly tokenRefreshExpireTime: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.saltRounds = Number(process.env.CRYPT_SALT);
    this.jwtSecretRefreshKey = process.env.JWT_SECRET_REFRESH_KEY;
    this.tokenRefreshExpireTime = process.env.TOKEN_REFRESH_EXPIRE_TIME;
  }

  async signup(signupDto: SignupDto) {
    const hashedPassword = await this.hashPassword(signupDto.password);
    const userPayload = { ...signupDto, password: hashedPassword };
    return this.usersService.create(userPayload);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByLogin(loginDto.login);
    if (
      user &&
      (await this.comparePasswords(loginDto.password, user.password))
    ) {
      const payload = this.createJwtPayload(user);
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    }
    throw new ForbiddenException(
      'Invalid login credentials. Please try again.',
    );
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      const newPayload = this.createJwtPayload(payload);
      const accessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('The refresh token is invalid or expired.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private createJwtPayload(user) {
    return { userId: user.id, login: user.login };
  }

  private generateAccessToken(payload) {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecretRefreshKey,
      expiresIn: this.tokenRefreshExpireTime,
    });
  }

  private verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.jwtSecretRefreshKey,
    });
  }
}
