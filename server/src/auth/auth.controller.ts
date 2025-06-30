import { Controller, UseGuards, Get, Req, Res, Post, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guards';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const refreshToken = await this.authService.generateRefreshToken(req.user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect('/');
  }

  @Post('refresh')
  async refreshToken(@Req() request: Request, @Res() res: Response) {
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
      res.statusCode = HttpStatus.OK;
      return res.send({ accessToken: access });
    }
  }

}
