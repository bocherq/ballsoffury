import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { TournamentService } from 'src/tournament/tournament.service';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        private tournamentService: TournamentService,
    ) {}

    async createGroupMatches(tournamentId: number, groupId: number) {
        const tournament = await this.tournamentService.getById(tournamentId);

        if (!tournament) {
            throw new NotFoundException('Tournament not found');
        }

        const group = await this.tournamentService.getGroupById(groupId);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        const players = group.players;

        const matches: Match[] = [];

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const match = this.matchRepository.create({
                    tournament,
                    group,
                    player1: players[i],
                    player2: players[j],
                });

                matches.push(match);
            }
        }

        await this.matchRepository.save(matches);
        console.log(`${group.name} matches was saved`);
    }

    async createRoundRobinMatches(tournamentId: number) {
        const tournament = await this.tournamentService.getById(tournamentId);

        if (!tournament) {
            throw new NotFoundException('Tournament not found');
        }

        const players = tournament.players;

        if (players.length < 2) {
            throw new BadRequestException('Not enough players to create matches');
        }

        const matches: Match[] = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
            const match = this.matchRepository.create({
                tournament,
                player1: players[i],
                player2: players[j],
            });

            matches.push(match);
            }
        }

        await this.matchRepository.save(matches);
    }
}
