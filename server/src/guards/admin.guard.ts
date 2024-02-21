import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from 'src/users/services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (token) {
      const payload = this.authService.verifyToken(token);
      req.currentUser = payload ? payload.id : null;
    } else req.currentUser = null;

    if (
      !req.currentUser ||
      req.currentUser !== this.configService.get<string>('ADMIN_UID')
    ) {
      throw new UnauthorizedException('Not authorized');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
