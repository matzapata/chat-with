export interface SubscriptionPlan {
  name: string;
  product_id: string;
  variant_id: string;
  description: string;
  variant_name: string;
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
  status: string;
  pause: string | null;
  cancelled: string | null;
  trial_ends_at: string | null;
  billing_anchor: number;
  renews_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
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
  status: string; // TODO: enum
  card_brand: string;
  card_last_four: string;
  pause: boolean;
  cancelled: boolean;
  trial_ends_at: string;
  billing_anchor: number;
  renews_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  resumes_at: string;
  test_mode: boolean;
}

export abstract class PaymentGateway {
  abstract getPlans(): Promise<SubscriptionPlan[]>;

  abstract createCheckoutUrl(
    variant_id: string,
    user_email: string,
    user_id: string,
  ): Promise<string>;

  abstract getSubscription(user_id: string): Promise<UserSubscription>;

  abstract getSubscriptionPortal(user_id: string): Promise<string>;

  abstract parseWebhookEvent(
    body: { [key: string]: any },
    headers: { [h: string]: any },
  ): Promise<{ event: WebhookEventName; data: WebhookEventData }>;
}
