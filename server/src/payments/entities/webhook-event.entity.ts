import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WebhookEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  created_at: string;

  @Column()
  event_name: string;

  @Column({ default: false })
  processed: boolean;

  @Column()
  body: string;

  @Column({ nullable: true })
  processing_error?: string;
}
