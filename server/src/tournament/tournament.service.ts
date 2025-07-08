import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDTO } from './tournament.dto';
import { Tournament } from 'src/entities/tournament.entity';
import { Player } from 'src/entities/player.entity';
import { UserService } from 'src/user/user.service';
@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private tournamentRepository: Repository<Tournament>,
        @InjectRepository(Player)
        private playerRepository: Repository<Player>,
        private userService: UserService,
    ) {}

    async get() {
        return await this.tournamentRepository.find({
            relations: ['players', 'matches'],
        });
    }

    async create(createTournament: CreateTournamentDTO) {
        const tournament = this.tournamentRepository.create(createTournament);
        console.log('Create tournament: ', createTournament);
        return await this.tournamentRepository.save(tournament);
    }

    async getById(id: number) {
        return await this.tournamentRepository.findOne({
            where: { id },
            relations: ['players', 'players.user', 'matches'],
        });
    }

    async joinTournament(tournamentId: number, userId: number) {
        const existingTournament = await this.getById(tournamentId);
        if (!existingTournament) throw new NotFoundException('Tournament not found');

        const existingUser = await this.userService.getById(userId);
        if (!existingUser) throw new NotFoundException('User not found');

        const existingPlayer = await this.playerRepository.findOne({
            where: {
                tournament: { id: tournamentId },
                user: { id: existingUser.id }
            }
        });
        if (existingPlayer) throw new ConflictException('The player is already registered in this tournament.');

        const newPlayer = this.playerRepository.create({ tournament: existingTournament, user: existingUser });
        await this.playerRepository.save(newPlayer);
        console.log(`User ${existingUser.firstName} ${existingUser.lastName} ${existingUser.id} joined to tournament ${existingTournament.id}`);

        return await this.getById(tournamentId);
    }
}
