import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SubscriptionUser } from './subscription-user.entity';

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
  status: string; // TODO: enum

  @Column()
  price: number;

  @Column()
  interval: string; // TODO: enum

  @Column()
  interval_count: number;

  @OneToMany(
    () => SubscriptionUser,
    (userSubscription) => userSubscription.plan,
  )
  subscriptions: SubscriptionUser[]; // Relation with UserSubscription
}
