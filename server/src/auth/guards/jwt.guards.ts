import { Observable } from 'rxjs';
import { AuthService } from './../auth.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization.trim();
        if (!authHeader) throw new UnauthorizedException('Access token is missing');

        const [ bearer, token ] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        const payload = await this.authService.verifyAccessToken(token);

        if (!payload || payload?.error) {
            throw new UnauthorizedException(payload.error || 'Invalid token');
        }

        request.user = payload;
        request.token = token;

        return true;
    }
}