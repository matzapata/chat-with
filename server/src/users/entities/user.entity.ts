import { File } from 'src/chat/entities/files.entity';
import { SubscriptionUser } from 'src/payments/entities/subscription-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
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

  @OneToMany(() => File, (file) => file.owner)
  @JoinColumn()
  files: File[];
}
