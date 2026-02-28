import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from './user.dto';

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
        });
    }

}
