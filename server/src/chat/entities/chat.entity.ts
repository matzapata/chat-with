import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './messages.entity';
import { MimeType } from 'src/infrastructure/rag/rag.service';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  filesize: number;

  @Column()
  mimetype: MimeType;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.chats)
  owner: User;

  @Column('text', { array: true })
  embeddings_ids: string[];

  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: ChatMessage[];
}
