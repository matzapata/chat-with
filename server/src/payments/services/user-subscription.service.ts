import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from '../../entities/payments/user-subscription';
import { User } from 'src/entities/users/user.entity';
import { SubscriptionPlan, plans } from '../config/plans';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionUserRepo: Repository<UserSubscription>,
  ) {}

  async find(
    user: User,
  ): Promise<{ sub: UserSubscription | null; plan: SubscriptionPlan }> {
    const sub = await this.subscriptionUserRepo.findOneBy({ user });
    return {
      sub,
      plan: Object.values(plans).find(
        (p) => p.variant_id === (sub?.variant_id || null),
      ),
    };
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

  async delete(user_id: string): Promise<void> {
    const sub = await this.subscriptionUserRepo.findOneBy({
      user: { id: user_id },
    });
    if (sub) {
      await this.subscriptionUserRepo.remove(sub).catch((e) => {
        console.log(e);
      });
    }
  }
}
