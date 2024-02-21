import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepo: Repository<SubscriptionPlan>,
  ) {}

  async findById(variant_id: string): Promise<SubscriptionPlan> {
    const plan = this.subscriptionPlanRepo.findOneBy({ variant_id });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    } else return plan;
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepo.find();
  }

  async create(
    plan: Omit<SubscriptionPlan, 'subscriptions'>,
  ): Promise<SubscriptionPlan> {
    return this.subscriptionPlanRepo.save({
      name: plan.name,
      product_id: plan.product_id,
      variant_id: plan.variant_id,
      description: plan.description,
      variant_name: plan.variant_name,
      status: plan.status,
      price: plan.price,
      interval: plan.interval,
      interval_count: plan.interval_count,
    });
  }

  async upsert(
    plan: Omit<SubscriptionPlan, 'subscriptions'>,
  ): Promise<SubscriptionPlan> {
    return this.subscriptionPlanRepo.save(plan);
  }
}
