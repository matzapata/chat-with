import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SubscriptionUser } from './subscription-user.entity';
import {
  SubscriptionInterval,
  SubscriptionPlanStatus,
} from 'src/infrastructure/payments/providers/payment.provider';

@Entity()
export class SubscriptionPlan {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @PrimaryColumn()
  variant_id: string;

  @Column()
  variant_name: string;

  @Column()
  product_id: string;

  @Column()
  product_name: string;

  @Column()
  status: SubscriptionPlanStatus;

  @Column()
  price: number;

  @Column()
  interval: SubscriptionInterval;

  @Column()
  interval_count: number;

  @OneToMany(
    () => SubscriptionUser,
    (userSubscription) => userSubscription.plan,
  )
  subscriptions: SubscriptionUser[]; // Relation with UserSubscription
}
