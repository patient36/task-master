import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new HttpException('Missing or invalid token', HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'email' in decoded) {
                const { id, email, role } = decoded as { id: string; email: string; role: string };
                request.user = { id, email, role };
                return true;
            } else {
                throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
            }
        } catch {
            throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }
    }
}
