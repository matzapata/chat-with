import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users/user.entity';
import { PaymentsModule } from './payments/payments.module';
import { UserSubscription } from './entities/payments/user-subscription';
import { WebhookEvent } from './entities/payments/webhook-event.entity';
import { ChatModule } from './chat/chat.module';
import { Chat } from './entities/chat/chat.entity';
import { ChatMessage } from './entities/chat/messages.entity';
import { ContactModule } from './contact/contact.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
        PORT: Joi.number().default(3000),
        LEMONSQUEEZY_STORE_ID: Joi.string().required(),
        LEMONSQUEEZY_API_KEY: Joi.string().required(),
        LEMONSQUEEZY_WEBHOOK_SECRET: Joi.string().required(),
        LEMONSQUEEZY_REDIRECT_URL: Joi.string().required(),
        ADMIN_UID: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),
        GCP_PROJECT_ID: Joi.string().required(),
        GCP_CLIENT_EMAIL: Joi.string().required(),
        GCP_PRIVATE_KEY: Joi.string().required(),
        GCP_STORAGE_BUCKET: Joi.string().required(),
        AUTH_JWKS_URI: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),

        // Select based on email provider
        // NODEMAILER_EMAIL_USER: Joi.string().required(),
        // NODEMAILER_EMAIL_PASSWORD: Joi.string().required(),
        RESEND_FROM_EMAIL: Joi.string().required(),
        RESEND_API_KEY: Joi.string().required(),
        CONTACT_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URL'),
        entities: [User, UserSubscription, WebhookEvent, Chat, ChatMessage],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
    }),
    LoggerModule.forRoot({}),
    UsersModule,
    PaymentsModule,
    ChatModule,
    ContactModule,
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
