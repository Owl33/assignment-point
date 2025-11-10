import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { getStore, saveStore, type StoredUser } from '../store';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private readonly refreshExpires = Number(process.env.JWT_REFRESH_EXPIRES!);
  private readonly sessionExpiresMs = Number(process.env.SESSION_EXPIRES!) * 1000;

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    this.startSession(user);
    const tokens = this.createTokenPair(user);
    await this.storeRefreshToken(user, tokens.refreshToken);
    saveStore();
    return this.buildAuthResponse(user, tokens);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('리프레쉬 없음');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(refreshToken, {
        secret: this.refreshSecret,
      });
      const user = this.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('사용자 없음');
      }
      await this.verifyRefreshToken(refreshToken, user);
      this.ensureSessionActive(user);
      const tokens = this.createTokenPair(user);
      await this.storeRefreshToken(user, tokens.refreshToken);
      saveStore();
      return this.buildAuthResponse(user, tokens);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('리프레쉬 검증 실패');
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return { success: true };
    }

    const user = await this.findUserByRefreshToken(refreshToken);
    if (user) {
      user.refreshTokenHash = null;
      user.sessionStartedAt = null;
      saveStore();
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
      throw new UnauthorizedException('리프레쉬 만료');
    }
    const matches = await compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException('리프레쉬 다름');
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
      throw new UnauthorizedException('세션 만료');
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
