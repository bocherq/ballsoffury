import { Controller, UseGuards, Get, Req, Res, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guards';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { JWTGuard } from './guards/jwt.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const refreshToken = await this.authService.generateRefreshToken(req.user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173/');
  }

  @Post('refresh')
  async refreshToken(@Req() request: Request) {
    const refreshToken = request.cookies['refresh_token'];
    const validToken = this.authService.verifyRefreshToken(refreshToken);
    const user = await this.userService.getById(validToken.id);
    if (!user) throw new UnauthorizedException('User not found');
    const access = await this.authService.generateAccessToken(user);
    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        throw new UnauthorizedException('Refresh token expired — login required');
      } else {
        throw new UnauthorizedException('Invalid refresh token');
      }
    } else {
      return { access_token: access };
    }
  }

  @UseGuards(JWTGuard)
  @Get('/me')
  async getAuthorizedUserData(@Req() req): Promise<User | null> {
    const token = req.headers.authorization.split(' ')[1];
    const validToken = this.authService.verifyAccessToken(token);
    return await this.userService.getById(validToken.id);
  }
}
