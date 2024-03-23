import { Chat } from 'src/entities/chat/chat.entity';
import { UserSubscription } from 'src/entities/payments/user-subscription';
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

  @OneToOne(() => UserSubscription, (subscription) => subscription.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  subscription: UserSubscription;

  @OneToMany(() => Chat, (c) => c.owner, { onDelete: 'CASCADE' })
  @JoinColumn()
  chats: Chat[];
}
