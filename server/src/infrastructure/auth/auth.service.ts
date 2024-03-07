import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(token, this.configService.get('JWT_SECRET'));
      return { id: payload.id, email: payload.email };
    } catch (e) {
      return null;
    }
  }
}
