import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity()
export class SubscriptionUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  subscription_id: string; // from provider

  @Column()
  provider: string; // TODO: enum

  @Column()
  order_id: string;

  @Column()
  status: string; // TODO: enum

  @Column()
  renews_at: string;

  @Column({ nullable: true })
  ends_at: string;

  @Column({ nullable: true })
  trial_ends_at: string;

  @Column({ nullable: true })
  pause_mode: string; // TODO: enum

  @Column({ nullable: true })
  pause_resumes_at: string;

  @Column()
  cancelled: boolean;

  @Column()
  billing_anchor: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @Column()
  test_mode: boolean;

  @OneToOne(() => User, (user) => user.subscription)
  user: User;

  @ManyToOne(() => SubscriptionPlan)
  plan: SubscriptionPlan;
}
