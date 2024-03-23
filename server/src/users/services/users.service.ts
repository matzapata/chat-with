import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: { subscription: true },
    });
  }

  create(id: string, email: string): Promise<User> {
    const user = this.repo.create({ id, email });
    return this.repo.save(user);
  }

  async update(user: User, name: string): Promise<User> {
    user.name = name;

    return this.repo.save(user);
  }
}
