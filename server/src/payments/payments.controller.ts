import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PaymentsService } from './services/payments.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/subscription/plans')
  getAllPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('/subscription/plans/refresh')
  // @UseGuards(AuthGuard) // TODO: should be only for admins
  async refreshPlans() {
    return this.paymentsService.refreshPlans();
  }

  @Get('/subscription')
  @UseGuards(AuthGuard)
  async getSubscription(@CurrentUser() userId: string) {
    const subscription = await this.paymentsService.getSubscription(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  @Post('/subscription')
  @UseGuards(AuthGuard)
  async createSubscriptionCheckout(
    @CurrentUser() userId: string,
    @Body() body: CreateSubscriptionDto,
  ) {
    const userSubscription = await this.paymentsService.getSubscription(userId);
    if (userSubscription) {
      throw new BadRequestException('User already has a subscription');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const url = await this.paymentsService.createSubscriptionCheckout(
      userId,
      user.email,
      body.variantId,
    );

    return { url };
  }

  @Get('/subscription/portal')
  @UseGuards(AuthGuard)
  async getSubscriptionPortal(@CurrentUser() userId: string) {
    const url = await this.paymentsService.getSubscriptionPortal(userId);
    return { url };
  }

  @Post('/webhook')
  async handleWebhook(
    @Body() body: { [key: string]: any },
    @Body() headers: { [key: string]: any },
  ) {
    await this.paymentsService.handleWebhook(body, headers);

    // TODO: Send notifications

    // TODO: Ensure status 200 is returned

    return 'OK';
  }
}
