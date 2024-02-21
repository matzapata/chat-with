import { SubscriptionUser } from 'src/payments/entities/subscription-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => SubscriptionUser, (subscription) => subscription.user)
  @JoinColumn()
  subscription: SubscriptionUser;
}
