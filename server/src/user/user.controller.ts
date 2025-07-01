import { Controller, Req, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { parseJwt } from 'src/utils/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
}
