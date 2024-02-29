import { Expose, Transform } from 'class-transformer';
import { ChatMessage } from '../entities/messages.entity';

export class ChatDto {
  @Expose()
  id: string;

  @Expose()
  filename: string;

  @Expose()
  created_at: Date;

  @Expose()
  @Transform(({ obj }) => obj.owner.id)
  owner: string;

  // @Transform(({ obj }) => obj)
  @Expose()
  @Transform(({ obj }) => obj.messages)
  messages: ChatMessage[];
}
