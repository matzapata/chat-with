import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  PaymentProviders,
  SubscriptionStatus,
} from '../../infrastructure/payments/providers/payment.provider';
import { User } from 'src/entities/users/user.entity';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, (user) => user.subscription)
  user: User;

  @Column()
  subscription_id: string; // from provider

  @Column()
  variant_id: string;

  @Column()
  order_id: string;

  @Column()
  provider: PaymentProviders;

  @Column()
  status: SubscriptionStatus;

  @Column()
  renews_at: Date;

  @Column({ nullable: true })
  ends_at: Date;

  @Column({ nullable: true })
  trial_ends_at: Date;

  @Column({ nullable: true })
  pause_mode: 'void' | 'free' | null;

  @Column({ nullable: true })
  pause_resumes_at: Date;

  @Column()
  cancelled: boolean;

  @Column()
  billing_anchor: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  test_mode: boolean;
}
