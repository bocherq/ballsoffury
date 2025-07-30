import { Player } from 'src/entities/player.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from './user.dto';
import { Match } from 'src/entities/match.entity';
import { calculateEloRating } from 'src/utils/rating';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDTO): Promise<User | null> {
        if (!createUserDto.email.includes(process.env.ALLOWED_EMAIL_DOMAIN ?? '')) {
            console.log('Login attempt with an unauthorized email')
            return null;
        }

        const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
        if (existingUser) {
            console.log('Login: ', existingUser);
            return existingUser;
        }

        console.log('Creating user: ', createUserDto);

        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async get(): Promise<User[]> {
        return await this.userRepository.find();
    } 

    async getById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['tournamentParticipations', 'tournamentParticipations.tournament'],
        });
    }

    async updateUserRating(match: Match): Promise<Match> {
        const user1 = match.player1.user;
        const user2 = match.player2.user;

        const { player1rating, player2rating } = calculateEloRating(user1.rating, user2.rating, match.player1Score > match.player2Score ? 1 : 0);

        match.player1RatingAfter = player1rating;
        match.player2RatingAfter = player2rating;

        user1.rating = player1rating;
        user2.rating = player2rating;

        await this.userRepository.save([user1, user2]);
        console.log(match);

        return { ...match };
    }

}
