import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { Repository } from 'typeorm';
import { CreateTournamentDTO } from './tournament.dto';
@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private tournamentRepository: Repository<Tournament>
    ) {}

    async create(createTournament: CreateTournamentDTO) {
        const tournament = this.tournamentRepository.create(createTournament);
        console.log('Create tournament: ', createTournament);
        return await this.tournamentRepository.save(tournament);
    }
}
