import { MatchesModule } from './../matches/matches.module';
import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { Player } from 'src/entities/player.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Group } from 'src/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Player, Group]),
    AuthModule,
    UserModule,
    MatchesModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
