import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { MessageAgent } from 'src/chat/services/rag.service';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  message: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  agent: MessageAgent;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;
}
