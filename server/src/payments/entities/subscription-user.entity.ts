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

  @Column()
  ends_at: string;

  @Column()
  trial_ends_at: string;

  @Column()
  resumes_at: string;

  @OneToOne(() => User, (user) => user.subscription)
  user: User;

  @ManyToOne(() => SubscriptionPlan)
  plan: SubscriptionPlan;
}
