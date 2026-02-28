import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(googleUser: CreateUserDTO) {
        return await this.usersService.create(googleUser);
    }

    async generateAccessToken(user: User) {
        try {
            return this.jwtService.sign({ id: user.id });
        } catch (err) {
            throw new InternalServerErrorException('Failed to generate token');
        }
    }

    async generateRefreshToken(userId: number) {
        return this.jwtService.sign(
            { id: userId },
            {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '30d',
            },
        )
    }

    verifyAccessToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            return { error: error.message };
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY })
        } catch (error) {
            return { error: error.message };
        }
    }
}
