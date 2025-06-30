import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { jwtConstants } from './config/jwt.config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateGoogleUser(googleUser: CreateUserDTO) {
        return await this.usersService.create(googleUser);
    }

    async generateAccessToken(user: User) {
        return {
            access_token: this.jwtService.sign({ id: user.id }),
        }
    }

    async generateRefreshToken(userId: number) {
        return {
            refresh_token: this.jwtService.sign(
                { id: userId },
                {
                    secret: jwtConstants.secret,
                    expiresIn: '30d',
                },
            ),
        };
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
            return this.jwtService.verify(token, { secret: jwtConstants.secret })
        } catch (error) {
            return { error: error.message };
        }
    }

    parseJwt(token: string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
        );

        return JSON.parse(jsonPayload);
    }
}
