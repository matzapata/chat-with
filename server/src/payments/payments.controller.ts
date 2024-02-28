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
import { SubscriptionPlansService } from './services/subscription-plans.service';
import { SubscriptionUserService } from './services/subscription-user.service';
import { WebhookEventsService } from './services/webhook-events-service';
import { PaymentsService } from '../infrastructure/payments/payments.service';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { WebhookEventName } from './entities/webhook-event.entity';
import { EmailService } from 'src/infrastructure/emails/email.service';
import { User } from 'src/users/entities/user.entity';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly subscriptionPlansService: SubscriptionPlansService,
    private readonly subscriptionUserService: SubscriptionUserService,
    private readonly usersService: UsersService,
    private readonly webhookEventsService: WebhookEventsService,
    private readonly emailService: EmailService,
  ) {}

  @Get('/subscription/plans')
  getAllPlans() {
    return this.subscriptionPlansService.findAll();
  }

  @Post('/subscription/plans/refresh')
  @UseGuards(AdminGuard)
  async refreshPlans() {
    const plans = await this.paymentService.findAllPlans();
    for (const plan of plans) {
      await this.subscriptionPlansService.upsert({
        description: plan.description,
        interval: plan.interval,
        interval_count: plan.interval_count,
        name: plan.name,
        price: plan.price,
        product_id: plan.product_id,
        status: plan.status,
        product_name: plan.product_name,
        variant_id: plan.variant_id,
        variant_name: plan.variant_name,
      });
    }

    return this.subscriptionPlansService.findAll();
  }

  @Get('/subscription')
  @UseGuards(AuthGuard)
  async getSubscription(@CurrentUser() user: User) {
    const subs = await this.subscriptionUserService.findByUserId(user.id);
    if (!subs) {
      throw new NotFoundException('Subscription not found');
    }

    return subs;
  }

  @Post('/subscription')
  @UseGuards(AuthGuard)
  async createSubscriptionCheckout(
    @CurrentUser() user: User,
    @Body() body: CreateSubscriptionDto,
  ) {
    const subs = await this.subscriptionUserService.findByUserId(user.id);
    if (subs) throw new BadRequestException('User already has a subscription');

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
    const userSubscription = await this.subscriptionUserService.findByUserId(
      user.id,
    );
    if (!userSubscription) {
      throw new Error('User has no subscription');
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
      const plan = await this.subscriptionPlansService.findById(
        data.variant_id,
      );
      if (!plan) throw new NotFoundException('Plan not found');
      const user = await this.usersService.findById(data.user_id);
      if (!user) throw new NotFoundException('User not found');

      await this.subscriptionUserService.upsert(
        data.subscription_id,
        user,
        plan,
        {
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
        },
      );

      // Send email to user notifying them of subscription update
      this.emailService.sendEmail({
        to: user.email,
        html: `Your subscription has been updated to ${data.status}`,
        subject: 'Subscription updated',
      });

      // Mark event as processed
      await this.webhookEventsService.setProcessed(webhookEvent.id, true);
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
