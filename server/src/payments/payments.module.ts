import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from '../entities/payments/user-subscription';
import { WebhookEvent } from '../entities/payments/webhook-event.entity';
import { PaymentsController } from './payments.controller';
import { AuthService } from 'src/infrastructure/auth/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { PaymentsService } from '../infrastructure/payments/payments.service';
import { UserSubscriptionService } from './services/user-subscription.service';
import { WebhookEventsService } from './services/webhook-events-service';
import { User } from 'src/entities/users/user.entity';
import { EmailService } from 'src/infrastructure/emails/email.service';
import { PlanCheckerService } from './services/plan-checker.service';

@Module({
  providers: [
    PaymentsService,
    AuthService,
    UsersService,
    UserSubscriptionService,
    WebhookEventsService,
    EmailService,
    PlanCheckerService,
  ],
  imports: [TypeOrmModule.forFeature([UserSubscription, WebhookEvent, User])],
  controllers: [PaymentsController],
  exports: [PlanCheckerService, UserSubscriptionService],
})
export class PaymentsModule {}
