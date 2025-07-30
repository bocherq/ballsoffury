import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { TournamentService } from 'src/tournament/tournament.service';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchResultDTO } from './matches.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        private tournamentService: TournamentService,
        private userService: UserService,
    ) {}

    async setMatchResult(matchId: number, matchResult: MatchResultDTO): Promise<Match> {
        const match = await this.matchRepository.findOne({
            where: { id: matchId },
            relations: ['player1', 'player2', 'tournament'],
        });

        if (!match) {
            throw new NotFoundException('Match not found');
        }

        if (match.player1Score && match.player2Score) {
            throw new BadRequestException('Match result already submitted');
        }

        const { player1Score, player2Score } = matchResult;

        match.player1Score = player1Score;
        match.player2Score = player2Score;
        match.player1RatingBefore = match.player1.user.rating;
        match.player2RatingBefore = match.player2.user.rating;

        await this.tournamentService.updatePlayerStats(match);
        const updatedMatch = await this.userService.updateUserRating(match);

        return await this.matchRepository.save(updatedMatch);
    }

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
