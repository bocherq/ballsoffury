import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { Player } from 'src/entities/player.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Player]),
    AuthModule,
    UserModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
