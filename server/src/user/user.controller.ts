import { Controller, Req, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTGuard } from 'src/auth/guards/jwt.guards';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JWTGuard)
  @Get('/me')
  async getAuthorizedProfile(@Req() req): Promise<User | null> {
    const token = req.headers.authorization.split(' ')[1];
    if (token) { 
      const tokenData = this.authService.parseJwt(token);
      return await this.userService.getById(tokenData.id);
    } else {
      return null;
    }
  }
}
