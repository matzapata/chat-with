import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { SubscriptionUser } from '../entities/subscription-user.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SubscriptionUserService {
  constructor(
    @InjectRepository(SubscriptionUser)
    private readonly subscriptionUserRepo: Repository<SubscriptionUser>,
  ) {}

  async findByUserId(user_id: string): Promise<SubscriptionUser | null> {
    return this.subscriptionUserRepo.findOneBy({ user: { id: user_id } });
  }

  async findAll() {
    return this.subscriptionUserRepo.find();
  }

  async create(
    user: User,
    plan: SubscriptionPlan,
    subscription: Omit<SubscriptionUser, 'user' | 'plan'>,
  ): Promise<SubscriptionUser> {
    const userSubscription = await this.subscriptionUserRepo.create({
      ...subscription,
      user,
      plan,
    });

    return this.subscriptionUserRepo.save(userSubscription);
  }

  async upsert(
    id: string,
    user: User,
    plan: SubscriptionPlan,
    subscription: Omit<SubscriptionUser, 'user' | 'plan' | 'id'>,
  ): Promise<SubscriptionUser> {
    const userSubscription = await this.subscriptionUserRepo.create({
      ...subscription,
      user,
      plan,
    });

    return this.subscriptionUserRepo.save(userSubscription);
  }
}
