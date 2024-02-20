import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { LemonSqueezyPaymentGateway } from './services/payment-gateway/payment.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { SubscriptionUser } from './entities/subscription-user.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { PaymentsController } from './payments.controller';
import { AuthService } from 'src/users/services/auth.service';
import { UsersService } from 'src/users/services/users.service';

@Module({
  providers: [
    PaymentsService,
    LemonSqueezyPaymentGateway,
    AuthService,
    UsersService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      User,
      SubscriptionPlan,
      SubscriptionUser,
      WebhookEvent,
    ]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
