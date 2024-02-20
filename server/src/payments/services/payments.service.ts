import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { SubscriptionUser } from '../entities/subscription-user.entity';
import { WebhookEvent } from '../entities/webhook-event.entity';
import { WebhookEventName } from './payment-gateway/payment.gateway';
import { User } from 'src/users/entities/user.entity';
import { LemonSqueezyPaymentGateway } from './payment-gateway/lemonsqueezy.gateway';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentGateway: LemonSqueezyPaymentGateway,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepo: Repository<SubscriptionPlan>,
    @InjectRepository(SubscriptionUser)
    private readonly subscriptionUserRepo: Repository<SubscriptionUser>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(WebhookEvent)
    private readonly webhookEventRepo: Repository<WebhookEvent>,
  ) {}

  async refreshPlans(): Promise<SubscriptionPlan[]> {
    const plans = await this.paymentGateway.getPlans();

    for (const plan of plans) {
      await this.subscriptionPlanRepo.save({
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

    return this.subscriptionPlanRepo.find();
  }

  async getPlan(variant_id: string): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepo.findOneBy({ variant_id });
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepo.find();
  }

  async createSubscriptionCheckout(
    user_id: string,
    user_email: string,
    variant_id: string,
  ): Promise<string> {
    return this.paymentGateway.createCheckoutUrl(
      variant_id,
      user_email,
      user_id,
    );
  }

  async getSubscription(user_id: string): Promise<SubscriptionUser | null> {
    return this.subscriptionUserRepo.findOneBy({ user: { id: user_id } });
  }

  async getSubscriptionPortal(user_id: string): Promise<string> {
    const userSubscription = await this.subscriptionUserRepo.findOneBy({
      user: { id: user_id },
    });
    if (!userSubscription) {
      throw new Error('User has no subscription');
    }

    const portalUrl = await this.paymentGateway.getSubscriptionPortal(
      userSubscription.subscription_id,
    );
    return portalUrl;
  }

  async handleWebhook(
    body: { [key: string]: any },
    headers: { [key: string]: any },
  ): Promise<void> {
    // Parse event and data
    const { event, data } = await this.paymentGateway.parseWebhookEvent(
      body,
      headers,
    );

    // Store event in db
    const webhookEvent = this.webhookEventRepo.create({
      created_at: data.created_at,
      event_name: event,
      processed: false,
      body: JSON.stringify(body),
    });
    await this.webhookEventRepo.save(webhookEvent);

    // Update user subscription
    if (event === WebhookEventName.subscription_created) {
      // Associate plan
      const plan = await this.subscriptionPlanRepo.findOneBy({
        variant_id: data.variant_id,
      });
      if (!plan) throw new Error('Plan not found');

      // Associate user
      const user = await this.usersRepo.findOneBy({ id: data.user_id });
      if (!user) throw new Error('User not found');

      const userSubscription = this.subscriptionUserRepo.create({
        subscription_id: data.subscription_id,
        provider: data.provider,
        order_id: data.order_id,
        status: data.status,
        renews_at: data.renews_at,
        ends_at: data.ends_at,
        trial_ends_at: data.trial_ends_at,
        resumes_at: data.resumes_at,
        user,
        plan,
      });

      await this.subscriptionUserRepo.save(userSubscription);
    }
    // else if (event === WebhookEventName.subscription_updated) {
    //   const userSubscription = await this.subscriptionUserRepo.findOneBy({
    //     subscription_id: data.id,
    //   });
    //   if (!userSubscription) {
    //     throw new Error('User subscription not found');
    //   }

    //   // Associate plan
    //   const plan = await this.subscriptionPlanRepo.findOneBy({
    //     variant_id: data.variant_id,
    //   });
    //   userSubscription.plan = plan;

    //   // // Associate user
    //   // const user = await this.usersRepo.findOneBy({ id: data.user_id });

    //   // await this.subscriptionUserRepo.save(userSubscription);
    // }

    // Mark event as processed
    webhookEvent.processed = true;
    await this.webhookEventRepo.save(webhookEvent);
  }
}
