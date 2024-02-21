export interface SubscriptionPlan {
  name: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  description: string;
  status: string;
  price: number;
  interval: string;
  interval_count: number;
}

export interface UserSubscription {
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  user_email: string;
  status:
    | 'on_trial'
    | 'active'
    | 'paused'
    | 'past_due'
    | 'unpaid'
    | 'cancelled'
    | 'expired';
  pause_mode: 'void' | 'free' | null;
  pause_resumes_at: string | null;
  cancelled: boolean;
  billing_anchor: number;
  renews_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  trial_ends_at: string | null;
  test_mode: boolean;
}

export enum WebhookEventName {
  subscription_created = 'subscription_created',
  subscription_updated = 'subscription_updated',
  subscription_payment_failed = 'subscription_payment_failed',
  subscription_payment_success = 'subscription_payment_success',
}

export interface WebhookEventData {
  id: string;
  subscription_id: string;
  provider: string;
  user_id: string;
  variant_id: string;
  order_id: string;
  status:
    | 'on_trial'
    | 'active'
    | 'paused'
    | 'past_due'
    | 'unpaid'
    | 'cancelled'
    | 'expired';
  card_brand: string;
  card_last_four: string;
  pause_mode: 'void' | 'free' | null;
  pause_resumes_at: string;
  cancelled: boolean;
  trial_ends_at: string;
  billing_anchor: number;
  renews_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

export enum PaymentProviders {
  lemonsqueezy = 'lemonsqueezy',
  // stripe = 'stripe',
}

export abstract class PaymentGateway {
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
