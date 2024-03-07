import { Chat } from 'src/chat/entities/chat.entity';
import { SubscriptionUser } from 'src/payments/entities/subscription-user.entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  name?: string;

  @OneToOne(() => SubscriptionUser, (subscription) => subscription.user)
  @JoinColumn()
  subscription: SubscriptionUser;

  @OneToMany(() => Chat, (c) => c.owner)
  @JoinColumn()
  chats: Chat[];
}
