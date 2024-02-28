import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

declare module 'express' {
  interface Request {
    currentUser: User | null;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    const payload = this.authService.verifyToken(token);

    if (payload) {
      req.currentUser = await this.usersService.findById(payload.id);
    } else req.currentUser = null;

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
