import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.service.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.login(dto, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user) {
    return { user };
  }
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.refresh(req, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Muvaffaqiyatli chiqildi' };
  }
}
