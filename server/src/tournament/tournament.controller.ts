import { Tournament } from 'src/entities/tournament.entity';
import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Get, Param, Req } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { IsAdmin } from 'src/auth/guards/admin.guards';
import { CreateTournamentDTO } from './tournament.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guards';
import { AuthService } from 'src/auth/auth.service';

@Controller('tournament')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(IsAdmin)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createTournament: CreateTournamentDTO): Promise<Tournament> {
    return await this.tournamentService.create(createTournament);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async get(): Promise<Tournament[]> {
    return await this.tournamentService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Tournament | null> {
    return await this.tournamentService.getById(Number(id));
  }

  @UseGuards(JWTGuard)
  @Post('join')
  @HttpCode(HttpStatus.OK)
  async join(@Req() req, @Body() joinData: { tournamentId: number }): Promise<Tournament | null> {
    console.log('join data: ', joinData);
    const token = req.headers.authorization.split(' ')[1];
    const { id } = this.authService.verifyAccessToken(token);
    console.log('user id ', id)
    return await this.tournamentService.joinTournament(joinData.tournamentId, id);
  }
} 
