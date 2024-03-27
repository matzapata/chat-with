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
import { UserSubscriptionService } from './services/user-subscription.service';
import { WebhookEventsService } from './services/webhook-events.service';
import { PaymentsService } from '../infrastructure/payments/payments.service';
import { EmailService } from 'src/infrastructure/emails/email.service';
import {
  SubscriptionStatus,
  WebhookEventName,
} from 'src/infrastructure/payments/providers/payment.provider';
import { plans } from './config/plans';
import { User } from '@prisma/client';

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
    const { sub, plan } = await this.userSubscriptionService.findByUserId(
      user.id,
    );
    return { subscription: sub, plan };
  }

  @Post('/subscription')
  @UseGuards(AuthGuard)
  async createSubscriptionCheckout(@CurrentUser() user: User) {
    const { sub } = await this.userSubscriptionService.findByUserId(user.id);
    if (sub && sub.status === SubscriptionStatus.active) {
      throw new BadRequestException('User already has an active subscription');
    }

    const url = await this.paymentService.createSubscriptionCheckout(
      plans.pro.variant_id,
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
    if (!userSubscription.sub) {
      throw new NotFoundException('User has no subscription');
    }

    const url = await this.paymentService.createSubscriptionPortal(
      userSubscription.sub.subscriptionId,
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
      createdAt: new Date(),
      eventName: event,
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

      if (data.status === SubscriptionStatus.cancelled) {
        await this.userSubscriptionService.deleteByUserId(user.id);
      } else if (data.status === SubscriptionStatus.active) {
        await this.userSubscriptionService.upsertByUserId(user.id, {
          variantId: data.variant_id,
          subscriptionId: data.subscription_id,
          provider: data.provider,
          orderId: data.order_id,
          status: data.status,
          renewsAt: data.renews_at,
          endsAt: data.ends_at,
          trialEndsAt: data.trial_ends_at,
          billingAnchor: data.billing_anchor,
          cancelled: data.cancelled,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          pauseMode: data.pause_mode,
          pauseResumesAt: data.pause_resumes_at,
          testMode: data.test_mode,
        });
      }

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
