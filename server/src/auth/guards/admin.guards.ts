import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";

@Injectable()
export class IsAdmin implements CanActivate {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

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

        const user = await this.userService.getById(validToken.id);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.isAdmin) {
            throw new ForbiddenException('Admin access required');
        }

        return true;
    }
}