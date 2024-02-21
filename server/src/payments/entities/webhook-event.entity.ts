import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum WebhookEventName {
  subscription_created = 'subscription_created',
  subscription_updated = 'subscription_updated',
  subscription_payment_failed = 'subscription_payment_failed',
  subscription_payment_success = 'subscription_payment_success',
}

@Entity()
export class WebhookEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  created_at: Date;

  @Column()
  event_name: WebhookEventName;

  @Column({ default: false })
  processed: boolean;

  @Column()
  body: string;

  @Column({ nullable: true })
  processing_error?: string;
}
