import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UsersService } from 'src/users/services/users.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { UserSubscriptionService } from './services/user-subscription.service';
import { WebhookEventsService } from './services/webhook-events-service';
import { PaymentsService } from '../infrastructure/payments/payments.service';
import { EmailService } from 'src/infrastructure/emails/email.service';
import { User } from 'src/users/entities/user.entity';
import {
  SubscriptionStatus,
  WebhookEventName,
} from 'src/infrastructure/payments/providers/payment.provider';
import { plans } from './config/plans';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly userSubscriptionService: UserSubscriptionService,
    private readonly usersService: UsersService,
    private readonly webhookEventsService: WebhookEventsService,
    private readonly emailService: EmailService,
  ) {}

  @Get('/plans')
  async getPlans() {
    return plans;
  }

  @Get('/subscription')
  @UseGuards(AuthGuard)
  async getSubscription(@CurrentUser() user: User) {
    const subs = await this.userSubscriptionService.findByUserId(user.id);
    const planId = subs?.variant_id ?? null;
    const plan = Object.values(plans).find((p) => p.variant_id === planId);
    return { subscription: subs, plan };
  }

  @Post('/subscription')
  @UseGuards(AuthGuard)
  async createSubscriptionCheckout(
    @CurrentUser() user: User,
    @Body() body: CreateSubscriptionDto,
  ) {
    const subs = await this.userSubscriptionService.findByUserId(user.id);
    if (subs && subs.status === SubscriptionStatus.active) {
      throw new BadRequestException('User already has an active subscription');
    }

    const url = await this.paymentService.createSubscriptionCheckout(
      body.variant_id,
      user.email,
      user.id,
    );

    return { url };
  }

  @Get('/subscription/portal')
  @UseGuards(AuthGuard)
  async getSubscriptionPortal(@CurrentUser() user: User) {
    const userSubscription = await this.userSubscriptionService.findByUserId(
      user.id,
    );
    if (!userSubscription) {
      throw new NotFoundException('User has no subscription');
    }

    const url = await this.paymentService.createSubscriptionPortal(
      userSubscription.subscription_id,
    );
    return { url };
  }

  @Post('/webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: { [key: string]: any },
    @Body() headers: { [key: string]: any },
  ) {
    // Verify webhook source
    await this.paymentService.validateWebhook(body, headers);

    // Parse event and data
    const { data, event } = await this.paymentService.parseWebhookEvent(body);

    // Store event in db
    const webhookEvent = await this.webhookEventsService.create({
      created_at: data.created_at,
      event_name: event,
      processed: false,
      body: JSON.stringify(body),
    });

    try {
      if (
        event !== WebhookEventName.subscription_created &&
        event !== WebhookEventName.subscription_updated
      ) {
        throw new BadRequestException('Unsupported event type');
      }

      // get associated plan and user
      const plan = await this.paymentService.findPlanById(data.variant_id);
      if (!plan) throw new NotFoundException('Plan not found');
      const user = await this.usersService.findById(data.user_id);
      if (!user) throw new NotFoundException('User not found');

      await this.userSubscriptionService.upsert(user, {
        variant_id: data.variant_id,
        subscription_id: data.subscription_id,
        provider: data.provider,
        order_id: data.order_id,
        status: data.status,
        renews_at: data.renews_at,
        ends_at: data.ends_at,
        trial_ends_at: data.trial_ends_at,
        billing_anchor: data.billing_anchor,
        cancelled: data.cancelled,
        created_at: data.created_at,
        updated_at: data.updated_at,
        pause_mode: data.pause_mode,
        pause_resumes_at: data.pause_resumes_at,
        test_mode: data.test_mode,
      });

      // Mark event as processed
      await this.webhookEventsService.setProcessed(webhookEvent.id, true);

      // Send email to user notifying them of subscription update
      await this.emailService.sendEmail({
        to: user.email,
        html: `Your subscription has been updated to ${data.status}`,
        subject: 'Subscription updated',
      });
    } catch (error) {
      console.error('Error processing webhook event', error);
      await this.webhookEventsService.setProcessed(
        webhookEvent.id,
        false,
        error.message,
      );
    }

    return 'OK';
  }
}
