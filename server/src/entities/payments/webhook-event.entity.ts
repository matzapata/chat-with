import { WebhookEventName } from 'src/infrastructure/payments/providers/payment.provider';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
