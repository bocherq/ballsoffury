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

    async create(createTournamentDTO: CreateTournamentDTO) {
        const tournament = this.tournamentRepository.create(createTournamentDTO);
        return await this.tournamentRepository.save(tournament);
    }
}
