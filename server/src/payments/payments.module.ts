import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { SubscriptionUser } from './entities/subscription-user.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { PaymentsController } from './payments.controller';
import { AuthService } from 'src/infrastructure/auth/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { PaymentsService } from '../infrastructure/payments/payments.service';
import { SubscriptionPlansService } from './services/subscription-plans.service';
import { SubscriptionUserService } from './services/subscription-user.service';
import { WebhookEventsService } from './services/webhook-events-service';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/infrastructure/emails/email.service';

@Module({
  providers: [
    PaymentsService,
    AuthService,
    UsersService,
    SubscriptionPlansService,
    SubscriptionUserService,
    WebhookEventsService,
    EmailService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      SubscriptionUser,
      WebhookEvent,
      User,
    ]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
