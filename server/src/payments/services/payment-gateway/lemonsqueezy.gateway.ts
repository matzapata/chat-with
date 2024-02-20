import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import {
  PaymentGateway,
  SubscriptionPlan,
  UserSubscription,
  WebhookEventData,
  WebhookEventName,
} from './payment.gateway';

@Injectable()
export class LemonSqueezyPaymentGateway implements PaymentGateway {
  LemonSqueezyClient: AxiosInstance;
  storeId: string;
  redirectUrl: string;
  apiKey: string;

  constructor(private readonly configService: ConfigService) {
    // Setup of variables
    this.storeId = this.configService.get<string>('LEMONSQUEEZY_STORE_ID');
    this.redirectUrl = this.configService.get<string>(
      'LEMONSQUEEZY_REDIRECT_URL',
    );
    this.apiKey = this.configService.get<string>('LEMONSQUEEZY_API_KEY');

    // Create client
    this.LemonSqueezyClient = axios.create({
      baseURL: 'https://api.lemonsqueezy.com/v1',
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  async createCheckoutUrl(
    variant_id: string,
    user_email: string,
    user_id: string,
  ): Promise<string> {
    const res = await this.LemonSqueezyClient.post('/checkouts', {
      data: {
        type: 'checkouts',
        checkout_data: {
          email: user_email, // Displays in the checkout form
          custom: {
            user_id: user_id, // Sent in the background; visible in webhooks and API calls
          },
        },
        product_options: {
          enabled_variants: [variant_id], // Only show the selected variant in the checkout
          redirect_url: `${this.redirectUrl}`,
          receipt_button_text: 'Go to your account',
          receipt_thank_you_note: 'Thank you for signing up!',
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

  async getPlans(): Promise<SubscriptionPlan[]> {
    let page = 1;
    const pageSize = 50;
    const plans: SubscriptionPlan[] = [];

    while (true) {
      const res = await this.listVariants(page, pageSize);
      plans.push(
        ...res.data
          .filter((v) => v.attributes.is_subscription)
          .map((v) => ({
            name: res.included.find(
              (p) => p.id === String(v.attributes.product_id),
            )?.attributes.name,
            product_id: String(v.attributes.product_id),
            variant_id: v.id,
            description: v.attributes.description,
            variant_name: v.attributes.name,
            status: v.attributes.status,
            price: v.attributes.price,
            interval: v.attributes.interval,
            interval_count: v.attributes.interval_count,
          })),
      );
      if (res.meta.page.currentPage === res.meta.page.lastPage) {
        break;
      } else page++;
    }

    return plans;
  }

  async getSubscription(subscriptionId: string): Promise<UserSubscription> {
    const res = await this.LemonSqueezyClient.get(
      `/subscriptions/${subscriptionId}`,
    );
    return {
      product_id: res.data.data.attributes.product_id,
      variant_id: res.data.data.attributes.variant_id,
      product_name: res.data.data.attributes.product_name,
      variant_name: res.data.data.attributes.variant_name,
      user_email: res.data.data.attributes.user_email,
      status: res.data.data.attributes.status,
      pause: res.data.data.attributes.pause,
      cancelled: res.data.data.attributes.cancelled,
      trial_ends_at: res.data.data.attributes.trial_ends_at,
      billing_anchor: res.data.data.attributes.billing_anchor,
      renews_at: res.data.data.attributes.renews_at,
      ends_at: res.data.data.attributes.ends_at,
      created_at: res.data.data.attributes.created_at,
      updated_at: res.data.data.attributes.updated_at,
      test_mode: res.data.data.attributes.test_mode,
    };
  }

  async getSubscriptionPortal(subscriptionId: string): Promise<string> {
    const res = await this.LemonSqueezyClient.get(
      `/subscriptions/${subscriptionId}`,
    );
    return res.data.data.attributes.urls.customer_portal;
  }
  async parseWebhookEvent(
    body: { [key: string]: any },
    headers: { [key: string]: any },
  ): Promise<{ event: WebhookEventName; data: WebhookEventData }> {
    const secret = this.configService.get<string>('LEMON_WEBHOOK_SECRET');
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(
      hmac.update(JSON.stringify(body)).digest('hex'),
      'utf8',
    );
    const signature = Buffer.from(headers['X-Signature'] || '', 'utf8');
    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error('Invalid signature.');
    }

    let event: WebhookEventName;
    let data: WebhookEventData;
    switch (headers['X-Event-Name']) {
      case 'subscription_created':
        event = WebhookEventName.subscription_created;
        data = {
          id: body.data.id,
          subscription_id: body.data.attributes.subscription_id,
          provider: 'lemonsqueezy',
          user_id: body.meta.custom_data.user_id,
          variant_id: body.data.attributes.variant_id,
          order_id: body.data.attributes.order_id,
          status: body.data.attributes.status,
          card_brand: body.data.attributes.card_brand,
          card_last_four: body.data.attributes.card_last_four,
          pause: body.data.attributes.pause,
          cancelled: body.data.attributes.cancelled,
          trial_ends_at: body.data.attributes.trial_ends_at,
          billing_anchor: body.data.attributes.billing_anchor,
          renews_at: body.data.attributes.renews_at,
          ends_at: body.data.attributes.ends_at,
          created_at: body.data.attributes.created_at,
          updated_at: body.data.attributes.updated_at,
          resumes_at: body.data.attributes.resumes_at,
          test_mode: body.data.attributes.test_mode,
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

  private async listVariants(
    page?: number,
    size?: number,
  ): Promise<{
    meta: {
      page: {
        currentPage: number;
        from: number;
        lastPage: number;
        perPage: number;
        to: number;
        total: number;
      };
    };
    data: {
      type: 'variants';
      id: string;
      attributes: {
        price: number;
        is_subscription: boolean;
        interval: string; // TODO: enum
        interval_count: number;
        has_free_trial: boolean;
        trial_interval: string;
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
        is_license_length_unlimited: false;
        sort: number;
        status: string; // TODO: enum
        status_formatted: string;
        created_at: string;
        updated_at: string;
        test_mode: boolean;
      };
    }[];
    included: {
      type: 'products';
      id: string;
      attributes: {
        store_id: number;
        name: string;
        slug: string;
        description: string | null;
        status: string;
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
    }[];
  }> {
    const query = page ? `&page[number]=${page}&page[size]=${size}` : '';
    const res = await this.LemonSqueezyClient.get(
      '/variants?include=product' + query,
    );
    return res.data;
  }
}
