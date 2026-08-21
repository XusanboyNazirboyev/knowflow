import { PrismaService } from '@/database/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { createHash, randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('This email already exists');
    }
    const hashedPassword = await this.hashedPass(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
      },
    });
    const { password, ...res } = user;
    return res;
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Email yoki parol noto'g'ri");

    const isMatch = await this.comparePass(user.password, dto.password);
    if (!isMatch) throw new UnauthorizedException("Email yoki parol noto'g'ri");

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    this.setTokenCookies(res, accessToken, refreshToken);

    const { password, ...safeUser } = user;
    return { user: safeUser };
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.['refreshToken'];
    if (!token) {
      throw new UnauthorizedException('Refresh token topilmadi');
    }

    let decoded: { sub: string; email: string };
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz');
    }

    const tokenHash = await this.hashToken(token);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !storedToken ||
      storedToken.revoked ||
      storedToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh token bekor qilingan yoki yaroqsiz',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const payload = { sub: user.id, email: user.email };
    const newAccessToken = await this.generateAccessToken(payload);
    const newRefreshToken = await this.generateRefreshToken(payload);
    await this.storeRefreshToken(user.id, newRefreshToken);

    this.setTokenCookies(res, newAccessToken, newRefreshToken);

    return { message: 'Token yangilandi' };
  }
  async forgotPassword() {}

  async resetPassword() {}

  async logout(req: Request, res: Response) {
    const token = req.cookies?.['refreshToken'];
    if (token) {
      const tokenHash = this.hashToken(token);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  private async hashedPass(pass: string) {
    const hashed = await argon.hash(pass);
    return hashed;
  }

  private async comparePass(hashedPass: string, orgPass: string) {
    const hashed = await argon.verify(hashedPass, orgPass);
    return hashed;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  private async storeRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
  
  private async generateAccessToken(payload: { sub: string; email: string }) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });
  }
  private async generateRefreshToken(payload: { sub: string; email: string }) {
    return this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );
  }
}
