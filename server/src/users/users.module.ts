import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { AuthService } from '../infrastructure/auth/auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersRepository } from './repositories/users.repository';
import { UserSubscriptionService } from 'src/payments/services/user-subscription.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [
    UsersService,
    AuthService,
    // UserSubscriptionService,
    UsersRepository,
  ],
  imports: [PrismaModule],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
