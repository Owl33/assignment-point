import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { getStore, saveStore, type StoredUser } from '../store';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private readonly refreshExpires = Number(process.env.JWT_REFRESH_EXPIRES!);
  private readonly sessionExpiresMs = Number(process.env.SESSION_EXPIRES!) * 1000;

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`로그인 ${loginDto.email}`);
    const user = this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      this.logger.warn(`로그인실패 ${loginDto.email}`);
      throw new UnauthorizedException();
    }

    this.startSession(user);
    const tokens = this.createTokenPair(user);
    await this.storeRefreshToken(user, tokens.refreshToken);
    saveStore();
    this.logger.log(`로그인성공 ${loginDto.email}`);
    return this.buildAuthResponse(user, tokens);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      this.logger.warn('리프레쉬 실패');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(refreshToken, {
        secret: this.refreshSecret,
      });
      const user = this.findUserById(payload.sub);
      if (!user) {
        this.logger.warn(`리프레쉬 실패 ${payload.sub}`);
        throw new UnauthorizedException();
      }
      await this.verifyRefreshToken(refreshToken, user);
      this.ensureSessionActive(user);
      const tokens = this.createTokenPair(user);
      await this.storeRefreshToken(user, tokens.refreshToken);
      saveStore();
      this.logger.log(`리프레쉬 성공 ${user.id}`);
      return this.buildAuthResponse(user, tokens);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('리프레쉬 실패 토큰만료');
      throw new UnauthorizedException();
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      this.logger.log('로그아웃 ');
      return { success: true };
    }

    const user = await this.findUserByRefreshToken(refreshToken);
    if (user) {
      user.refreshTokenHash = null;
      user.sessionStartedAt = null;
      saveStore();
      this.logger.log(`로그아웃성공 ${user.id}`);
    } else {
      this.logger.warn('로그아웃 실패');
    }
    return { success: true };
  }

  findUserById(id: number) {
    return getStore().users.find((user) => user.id === id);
  }

  private validateUser(email: string, password: string) {
    return getStore().users.find((user) => user.email === email && user.password === password);
  }

  private createTokenPair(user: StoredUser) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpires,
      },
    );

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(user: StoredUser, refreshToken: string) {
    user.refreshTokenHash = await hash(refreshToken, 10);
  }

  private async verifyRefreshToken(refreshToken: string, user: StoredUser) {
    if (!user.refreshTokenHash) {
      this.logger.warn(`리프레쉬만료 ${user.id}`);
      throw new UnauthorizedException();
    }
    const matches = await compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      this.logger.warn(`리프레쉬다름 ${user.id}`);
      throw new UnauthorizedException();
    }
  }

  private async findUserByRefreshToken(refreshToken: string) {
    for (const user of getStore().users) {
      if (!user.refreshTokenHash) continue;
      const matches = await compare(refreshToken, user.refreshTokenHash);
      if (matches) {
        return user;
      }
    }
    return null;
  }

  private stripSensitiveFields(user: StoredUser) {
    const { password: _password, refreshTokenHash: _refresh, sessionStartedAt: _session, ...safeUser } =
      user;
    return safeUser;
  }

  private startSession(user: StoredUser) {
    user.sessionStartedAt = new Date().toISOString();
  }

  private ensureSessionActive(user: StoredUser) {
    const expiresAt = this.computeSessionExpiry(user);
    if (!expiresAt || expiresAt.getTime() <= Date.now()) {
      user.sessionStartedAt = null;
      user.refreshTokenHash = null;
      saveStore();
      this.logger.warn(`세션만료 ${user.id}`);
      throw new UnauthorizedException();
    }
    return expiresAt;
  }

  private computeSessionExpiry(user: StoredUser) {
    if (!user.sessionStartedAt) {
      return null;
    }
    const startedAt = Date.parse(user.sessionStartedAt);
    if (Number.isNaN(startedAt)) {
      return null;
    }
    return new Date(startedAt + this.sessionExpiresMs);
  }

  private buildAuthResponse(user: StoredUser, tokens: { accessToken: string; refreshToken: string }) {
    const sessionExpiresAt = this.computeSessionExpiry(user)?.toISOString() ?? null;
    return { user: this.stripSensitiveFields(user), ...tokens, sessionExpiresAt };
  }
}
