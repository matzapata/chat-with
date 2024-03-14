import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from '../entities/user-subscription';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionUserRepo: Repository<UserSubscription>,
  ) {}

  async findByUserId(user_id: string): Promise<UserSubscription | null> {
    return this.subscriptionUserRepo.findOneBy({ user: { id: user_id } });
  }

  async findAll() {
    return this.subscriptionUserRepo.find();
  }

  async create(
    user: User,
    subscription: Omit<UserSubscription, 'user' | 'id'>,
  ): Promise<UserSubscription> {
    const userSubscription = await this.subscriptionUserRepo.create({
      ...subscription,
      user,
    });

    return this.subscriptionUserRepo.save(userSubscription);
  }

  async update(subscription, update: Partial<UserSubscription>) {
    return this.subscriptionUserRepo.save({ ...subscription, ...update });
  }

  async upsert(
    user: User,
    subscription: Omit<UserSubscription, 'user' | 'id'>,
  ): Promise<UserSubscription> {
    const sub = await this.subscriptionUserRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (sub) {
      return this.update(sub, subscription);
    } else {
      return this.create(user, subscription);
    }
  }
}
