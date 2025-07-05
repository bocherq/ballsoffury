import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
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
    return this.tournamentService.create(createTournament);
  }
} 
