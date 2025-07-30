import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { TournamentModule } from 'src/tournament/tournament.module';
import { UserModule } from 'src/user/user.module';
import { Player } from 'src/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Player]),
    UserModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
