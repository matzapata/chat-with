import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import {
  PaymentProviders,
  SubscriptionStatus,
} from '../../infrastructure/payments/providers/payment.provider';

@Entity()
export class SubscriptionUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  subscription_id: string; // from provider

  @Column()
  provider: PaymentProviders;

  @Column()
  order_id: string;

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

  @OneToOne(() => User, (user) => user.subscription)
  user: User;

  @ManyToOne(() => SubscriptionPlan)
  plan: SubscriptionPlan;
}
