import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findUserByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findUserById(id);
  }

  create(id: string, email: string): Promise<User> {
    return this.repo.createUser({ id, email });
  }

  update(id: string, name: string): Promise<User> {
    return this.repo.updateUser(id, { name });
  }
}
