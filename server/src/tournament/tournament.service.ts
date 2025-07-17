import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDTO } from './tournament.dto';
import { Tournament } from 'src/entities/tournament.entity';
import { Player } from 'src/entities/player.entity';
import { UserService } from 'src/user/user.service';
import { Group } from 'src/entities/group.entity';
@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private tournamentRepository: Repository<Tournament>,
        @InjectRepository(Player)
        private playerRepository: Repository<Player>,
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        private userService: UserService,
    ) {}

    async get() {
        return await this.tournamentRepository.find({
            relations: ['players'],
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
            relations: ['players', 'players.user', 'matches', 'groups'],
        });
    }

    async getGroupById(id: number) {
        return await this.groupRepository.findOne({
            where: { id },
            relations: ['players', 'matches'],
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

    async distributePlayersIntoGroups(tournamentId: number, groupCount: number): Promise<void> {
        const tournament = await this.getById(tournamentId);

        if (!tournament) {
            throw new NotFoundException('Tournament not found');
        }

        const players = [...tournament.players];

        if (players.length < groupCount * 3 || groupCount < 1) {
            throw new BadRequestException('Invalid group count');
        }

        players.sort((a, b) => b.user.rating - a.user.rating);

        const groups: Group[] = [];
        for (let i = 0; i < groupCount; i++) {
            const group = this.groupRepository.create({
            name: `Group ${String.fromCharCode(65 + i)}`,
            tournament,
            });
            console.log('Create group: ', group);
            groups.push(group);
        }

        await this.groupRepository.save(groups);
        console.log('Groups was saved');

        let direction = 1;
        let groupIndex = 0;


        for (const player of players) {
            const group = groups[groupIndex];
            player.group = group;

            groupIndex += direction;

            if (groupIndex === groupCount) {
                groupIndex = groupCount - 1;
                direction = -1;
            } else if (groupIndex < 0) {
                groupIndex = 0;
                direction = 1;
            }
        }

        await this.playerRepository.save(players);
    }
}
