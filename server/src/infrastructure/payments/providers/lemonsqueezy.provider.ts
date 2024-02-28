import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import {
  PaymentProvider,
  PaymentProviders,
  SubscriptionPlan,
  UserSubscription,
  WebhookEventData,
} from './payment.provider';
import { SubscriptionStatus } from 'src/payments/entities/subscription-user.entity';
import {
  SubscriptionInterval,
  SubscriptionPlanStatus,
} from 'src/payments/entities/subscription-plan.entity';
import { WebhookEventName } from 'src/payments/entities/webhook-event.entity';

interface PaginationObject {
  currentPage: number;
  from: number;
  lastPage: number;
  perPage: number;
  to: number;
  total: number;
}

interface VariantObject {
  type: 'variants';
  id: string;
  attributes: {
    price: number;
    is_subscription: boolean;
    interval: SubscriptionInterval;
    interval_count: number;
    has_free_trial: boolean;
    trial_interval: SubscriptionInterval;
    trial_interval_count: number;
    pay_what_you_want: boolean;
    min_price: number;
    suggested_price: number;
    product_id: number;
    name: string;
    slug: string;
    description: string | null;
    has_license_keys: boolean;
    license_activation_limit: number;
    is_license_limit_unlimited: boolean;
    license_length_value: number;
    license_length_unit: string;
    is_license_length_unlimited: boolean;
    sort: number;
    status: SubscriptionPlanStatus;
    status_formatted: string;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

interface ProductObject {
  type: 'products';
  id: string;
  attributes: {
    store_id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'published' | 'draft';
    status_formatted: string;
    thumb_url: string | null;
    large_thumb_url: string | null;
    price: number;
    price_formatted: string;
    from_price: number | null;
    to_price: number | null;
    pay_what_you_want: boolean;
    buy_now_url: string;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

interface SubscriptionObject {
  type: 'subscriptions';
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: SubscriptionStatus;
    status_formatted: string;
    card_brand: string | null;
    card_last_four: string | null;
    pause: { mode: 'void' | 'free'; resumes_at: string } | null;
    cancelled: boolean;
    trial_ends_at: Date | null;
    billing_anchor: number;
    first_subscription_item: {
      id: number;
      subscription_id: number;
      price_id: number;
      quantity: number;
      created_at: string;
      updated_at: string;
    } | null;
    urls: {
      update_payment_method: string;
      customer_portal: string;
      customer_portal_update_subscription: string;
    };
    renews_at: string;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

@Injectable()
export class LemonSqueezyPaymentProvider implements PaymentProvider {
  private readonly client: AxiosInstance;
  private readonly storeId: string;
  private readonly redirectUrl: string;
  private readonly apiKey: string;
  private readonly name: PaymentProviders = PaymentProviders.lemonsqueezy;

  constructor(private readonly configService: ConfigService) {
    // Setup of variables
    this.storeId = this.configService.get<string>('LEMONSQUEEZY_STORE_ID');
    this.redirectUrl = this.configService.get<string>(
      'LEMONSQUEEZY_REDIRECT_URL',
    );
    this.apiKey = this.configService.get<string>('LEMONSQUEEZY_API_KEY');

    // Create client
    this.client = axios.create({
      baseURL: 'https://api.lemonsqueezy.com/v1',
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  async createSubscriptionCheckout(
    variant_id: string,
    user_email: string,
    user_id: string,
  ): Promise<string> {
    const res = await this.client.post('/checkouts', {
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            enabled_variants: [variant_id], // Only show the selected variant in the checkout
            redirect_url: this.redirectUrl,
            receipt_button_text: 'Go to your account',
            receipt_thank_you_note: 'Thank you for signing up!',
          },
          checkout_data: {
            email: user_email, // Displays in the checkout form
            custom: {
              user_id: user_id, // Sent in the background; visible in webhooks and API calls
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: this.storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variant_id,
            },
          },
        },
      },
    });

    return res.data.data.attributes.url;
  }

  async findAllPlans(): Promise<SubscriptionPlan[]> {
    let page = 1;
    const pageSize = 50;
    const plans: SubscriptionPlan[] = [];

    while (true) {
      const res = await this.listVariants(page, pageSize);
      plans.push(
        ...res.data
          .filter((v) => v.attributes.is_subscription)
          .map((v) => {
            const product = res.included.find(
              (p) => p.id === String(v.attributes.product_id),
            );
            return {
              name: product?.attributes.name,
              product_id: String(v.attributes.product_id),
              variant_id: v.id,
              description: v.attributes.description,
              variant_name: v.attributes.name,
              status: v.attributes.status,
              price: v.attributes.price,
              interval: v.attributes.interval,
              interval_count: v.attributes.interval_count,
              product_name: product?.attributes.name,
            };
          }),
      );
      if (res.meta.page.currentPage === res.meta.page.lastPage) {
        break;
      } else page++;
    }

    return plans;
  }

  async findPlanById(variant_id: string): Promise<SubscriptionPlan> {
    throw new Error('Method not implemented.');
  }

  async findSubscriptionById(
    subscription_id: string,
  ): Promise<UserSubscription> {
    const res = await this.client.get(`/subscriptions/${subscription_id}`);
    const subscription = res.data.data as SubscriptionObject;
    return {
      product_id: String(subscription.attributes.product_id),
      variant_id: String(subscription.attributes.variant_id),
      product_name: subscription.attributes.product_name,
      variant_name: subscription.attributes.variant_name,
      user_email: subscription.attributes.user_email,
      status: subscription.attributes.status,
      pause_mode: subscription.attributes.pause?.mode,
      pause_resumes_at: subscription.attributes.pause?.resumes_at
        ? new Date(subscription.attributes.pause?.resumes_at)
        : null,
      cancelled: subscription.attributes.cancelled,
      billing_anchor: subscription.attributes.billing_anchor,
      renews_at: new Date(subscription.attributes.renews_at),
      ends_at: new Date(subscription.attributes.ends_at),
      created_at: new Date(subscription.attributes.created_at),
      updated_at: new Date(subscription.attributes.updated_at),
      trial_ends_at: subscription.attributes.trial_ends_at
        ? new Date(subscription.attributes.trial_ends_at)
        : null,
      test_mode: subscription.attributes.test_mode,
    };
  }

  async createSubscriptionPortal(subscription_id: string): Promise<string> {
    const res = await this.client.get(`/subscriptions/${subscription_id}`);
    return res.data.data.attributes.urls.customer_portal;
  }

  // Webhook methods
  async validateWebhook(
    body: { [key: string]: any },
    headers: { [key: string]: any },
  ): Promise<void> {
    const secret = this.configService.get<string>('LEMON_WEBHOOK_SECRET');
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(
      hmac.update(JSON.stringify(body)).digest('hex'),
      'utf8',
    );
    const signature = Buffer.from(headers['X-Signature'] || '', 'utf8');
    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new UnauthorizedException('Invalid signature.');
    }
  }

  async parseWebhookEvent(body: {
    [key: string]: any;
  }): Promise<{ event: WebhookEventName; data: WebhookEventData }> {
    let event: WebhookEventName;
    let data: WebhookEventData;

    switch (body.meta.event_name) {
      case 'subscription_created':
        const subscription = body.data as SubscriptionObject;
        event = WebhookEventName.subscription_created;
        data = {
          id: body.data.id,
          subscription_id:
            body.data.attributes.first_subscription_item.subscription_id,
          provider: this.name,
          user_id: body.meta.custom_data.user_id,
          variant_id: String(subscription.attributes.variant_id),
          order_id: String(subscription.attributes.order_id),
          status: subscription.attributes.status,
          card_brand: subscription.attributes.card_brand,
          card_last_four: subscription.attributes.card_last_four,
          pause_mode: subscription.attributes.pause?.mode ?? null,
          pause_resumes_at: subscription.attributes.pause?.resumes_at
            ? new Date(subscription.attributes.pause.resumes_at)
            : null,
          cancelled: subscription.attributes.cancelled,
          trial_ends_at: new Date(subscription.attributes.trial_ends_at),
          billing_anchor: subscription.attributes.billing_anchor,
          renews_at: new Date(subscription.attributes.renews_at),
          ends_at: new Date(subscription.attributes.ends_at),
          created_at: new Date(subscription.attributes.created_at),
          updated_at: new Date(subscription.attributes.updated_at),
          test_mode: subscription.attributes.test_mode,
        };
        break;
      case 'subscription_updated':
        event = WebhookEventName.subscription_updated;
        break;
      case 'subscription_payment_failed':
        event = WebhookEventName.subscription_payment_failed;
        break;
      case 'subscription_payment_success':
        event = WebhookEventName.subscription_payment_success;
        break;
      default:
        throw new Error('Unhandled event');
    }

    return {
      event: event,
      data: data,
    };
  }

  // Private utils
  private async listVariants(
    page?: number,
    size?: number,
  ): Promise<{
    meta: { page: PaginationObject };
    data: VariantObject[];
    included: ProductObject[];
  }> {
    const query = page ? `&page[number]=${page}&page[size]=${size}` : '';
    const res = await this.client.get('/variants?include=product' + query);
    return res.data;
  }
}
