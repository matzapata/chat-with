import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

const scrypt = promisify(_scrypt);

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signup(email: string, password: string): Promise<User> {
    if (await this.usersService.findByEmail(email)) {
      throw new BadRequestException('User already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer; // Hash the salt and the password together
    const hashedPassword = salt + '.' + hash.toString('hex'); // Join the hashed result and the salt together

    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    const tokenPayload: JwtPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, this.configService.get('JWT_SECRET'), {
      expiresIn: '1h',
    });

    return { user, token };
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.configService.get('JWT_SECRET'));
    } catch (e) {
      return null;
    }
  }
}
