import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Get, Param } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { IsAdmin } from 'src/auth/guards/admin.guards';
import { CreateTournamentDTO } from './tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @UseGuards(IsAdmin)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createTournament: CreateTournamentDTO) {
    return await this.tournamentService.create(createTournament);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async get() {
    return await this.tournamentService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.tournamentService.getById(Number(id));
  }
} 
