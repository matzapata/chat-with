import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SubscriptionUser } from './subscription-user.entity';

export enum SubscriptionInterval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export enum SubscriptionPlanStatus {
  pending = 'pending',
  draft = 'draft',
  published = 'published',
}

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
