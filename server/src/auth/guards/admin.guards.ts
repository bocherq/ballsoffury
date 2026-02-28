import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";

@Injectable()
export class IsAdmin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const user = request.user;
        if (!user) throw new UnauthorizedException('User not authenticated');
        if (!user.IsAdmin) throw new ForbiddenException('Admin access required');

        return true;
    }
}