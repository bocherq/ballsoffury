import { Controller, HttpStatus, HttpCode, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get(): Promise<User[]> {
    return await this.userService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getById(Number(id));
  }
}
