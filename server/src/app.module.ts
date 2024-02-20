import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionPlan } from './payments/entities/subscription-plan.entity';
import { SubscriptionUser } from './payments/entities/subscription-user.entity';
import { WebhookEvent } from './payments/entities/webhook-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        LEMONSQUEEZY_STORE_ID: Joi.string().required(),
        LEMONSQUEEZY_API_KEY: Joi.string().required(),
        LEMONSQUEEZY_WEBHOOK_SECRET: Joi.string().required(),
        LEMONSQUEEZY_REDIRECT_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, SubscriptionPlan, SubscriptionUser, WebhookEvent],
      synchronize: true,
    }),
    UsersModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
