import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchResultDTO } from './matches.dto';
import { Player } from 'src/entities/player.entity';
import { UserService } from 'src/user/user.service';
import { Tournament } from 'src/entities/tournament.entity';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Player)
        private playerRepository: Repository<Player>,
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

        await this.updatePlayerStats(match);
        const updatedMatch = await this.userService.updateUserRating(match);

        return await this.matchRepository.save(updatedMatch);
    }

    async createGroupMatches(tournament: Tournament, groupId: number) {
        const group = tournament.groups.find((group) => group.id === groupId);

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

    async createRoundRobinMatches(tournament: Tournament) {
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

    async updatePlayerStats(match: Match) {
        const { player1, player2, player1Score, player2Score } = match;
        const isDraw = player1Score === player2Score;
        const player1IsWinner = player1Score > player2Score && !isDraw;
        const player2IsWinner = player2Score > player1Score && !isDraw;

        if (isDraw) {
            player1.draws = player1.draws + 1;
            player2.draws = player2.draws + 1;
            player1.score = player1.score + 1;
            player2.score = player2.score + 1;

            await this.playerRepository.save([player1, player2]);
            return;
        }

        player1.wins = player1IsWinner ? player1.wins + 1 : player1.wins;
        player1.losses = player2IsWinner ? player1.losses + 1 : player1.losses;
        player1.score = player1IsWinner ? player1.score + 2 : player1.score;
        player1.scoreDifference = player1Score - player2Score;

        player2.wins = player2IsWinner ? player2.wins + 1 : player2.wins;
        player2.losses = player1IsWinner ? player2.losses + 1 : player2.losses;
        player2.score = player2IsWinner ? player2.score + 2 : player1.score;
        player2.scoreDifference = player2Score - player1Score;

        await this.playerRepository.save([player1, player2]);
    }
}
