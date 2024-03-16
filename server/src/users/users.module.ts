import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { AuthService } from '../infrastructure/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PaymentsModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
