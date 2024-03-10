export enum WebhookEventName {
  subscription_created = 'subscription_created',
  subscription_updated = 'subscription_updated',
  subscription_payment_failed = 'subscription_payment_failed',
  subscription_payment_success = 'subscription_payment_success',
}

export enum SubscriptionStatus {
  on_trial = 'on_trial',
  active = 'active',
  paused = 'paused',
  past_due = 'past_due',
  unpaid = 'unpaid',
  cancelled = 'cancelled',
  expired = 'expired',
}

export enum SubscriptionInterval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export enum SubscriptionPlanStatus {
  pending = 'pending',
  draft = 'draft',
  published = 'published',
}

export interface SubscriptionPlan {
  name: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  description: string;
  status: SubscriptionPlanStatus;
  price: number;
  interval: SubscriptionInterval;
  interval_count: number;
}

export interface UserSubscription {
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  user_email: string;
  status: SubscriptionStatus;
  pause_mode: 'void' | 'free' | null;
  pause_resumes_at: Date | null;
  cancelled: boolean;
  billing_anchor: number;
  renews_at: Date;
  ends_at: Date | null;
  created_at: Date;
  updated_at: Date;
  trial_ends_at: Date | null;
  test_mode: boolean;
}

export interface WebhookEventData {
  id: string;
  subscription_id: string;
  provider: PaymentProviders;
  user_id: string;
  variant_id: string;
  order_id: string;
  status: SubscriptionStatus;
  card_brand: string;
  card_last_four: string;
  pause_mode: 'void' | 'free' | null;
  pause_resumes_at: Date;
  cancelled: boolean;
  trial_ends_at: Date;
  billing_anchor: number;
  renews_at: Date;
  ends_at: Date;
  created_at: Date;
  updated_at: Date;
  test_mode: boolean;
}

export enum PaymentProviders {
  lemonsqueezy = 'lemonsqueezy',
  // stripe = 'stripe',
}

export abstract class PaymentProvider {
  abstract findPlanById(variant_id: string): Promise<SubscriptionPlan>;

  abstract findAllPlans(): Promise<SubscriptionPlan[]>;

  abstract findSubscriptionById(
    subscription_id: string,
  ): Promise<UserSubscription>;

  abstract createSubscriptionPortal(subscription_id: string): Promise<string>;

  abstract createSubscriptionCheckout(
    variant_id: string,
    user_email: string,
    user_id: string,
  ): Promise<string>;

  abstract validateWebhook(
    body: { [key: string]: any },
    headers: { [h: string]: any },
  ): Promise<void>;

  abstract parseWebhookEvent(
    body: { [key: string]: any },
    headers: { [h: string]: any },
  ): Promise<{ event: WebhookEventName; data: WebhookEventData }>;
}
