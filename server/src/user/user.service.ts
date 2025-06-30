import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(createUserDto: CreateUserDTO): Promise<User | null> {
        const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
        if (!createUserDto.email.includes(process.env.ALLOWED_EMAIL_DOMAIN ?? '') || existingUser) {
            return null;
        }

        console.log('Creating user: ', createUserDto);

        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }
}
