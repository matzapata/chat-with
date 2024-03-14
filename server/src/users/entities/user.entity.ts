import { Chat } from 'src/chat/entities/chat.entity';
import { UserSubscription } from 'src/payments/entities/user-subscription';
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

  @OneToOne(() => UserSubscription, (subscription) => subscription.user)
  @JoinColumn()
  subscription: UserSubscription;

  @OneToMany(() => Chat, (c) => c.owner)
  @JoinColumn()
  chats: Chat[];
}
