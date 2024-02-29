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
import { ChatModule } from './chat/chat.module';
import { File } from './chat/entities/files.entity';

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
        ADMIN_UID: Joi.string().required(),
        NODEMAILER_EMAIL_USER: Joi.string().required(),
        NODEMAILER_EMAIL_PASSWORD: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'chatwith',
      synchronize: true,
      entities: [User, SubscriptionPlan, SubscriptionUser, WebhookEvent, File],
    }),
    UsersModule,
    PaymentsModule,
    ChatModule,
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
