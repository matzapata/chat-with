import { Expose, Transform } from 'class-transformer';
import { ChatMessage } from '../entities/messages.entity';
import { MimeType } from 'src/infrastructure/vectorstore/vectorstore.service';

export class ChatDto {
  @Expose()
  id: string;

  @Expose()
  filename: string;

  @Expose()
  filesize: number;

  @Expose()
  mimetype: MimeType;

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
