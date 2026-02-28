import { Observable } from 'rxjs';
import { AuthService } from './../auth.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) {}

    // @ts-ignore
    async canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) throw new UnauthorizedException('Access token is missing');

        const token = request.headers.authorization.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Access token is missing');
        }

        const validToken = this.authService.verifyAccessToken(token);

        if (!validToken || validToken?.error) {
            throw new UnauthorizedException(validToken.error || 'Invalid token');
        }

        return (request.token = token);
    }
}