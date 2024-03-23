import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Chat } from '../../entities/chat/chat.entity';
import { User } from 'src/entities/users/user.entity';
import { ChatMessage } from '../../entities/chat/messages.entity';
import { MessageAgent } from 'src/chat/services/rag.service';
import { MimeType } from 'src/infrastructure/vectorstore/vectorstore.service';

export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly messagesRepository: Repository<ChatMessage>,
  ) {}

  async create(
    owner: User,
    filename: string,
    filesize: number,
    mimetype: MimeType,
    embeddings_ids: string[],
  ): Promise<Chat> {
    const chat = this.chatRepository.create({
      owner: owner,
      filename: filename,
      filesize: filesize,
      embeddings_ids: embeddings_ids,
      mimetype,
    });
    return this.chatRepository.save(chat);
  }

  async delete(id: string) {
    return this.chatRepository.delete(id);
  }

  async findAllOwnedBy(owner: User): Promise<Chat[]> {
    return this.chatRepository.find({ where: { owner } });
  }

  async findFileForOwner(owner: User, filename: string): Promise<Chat | null> {
    return this.chatRepository.findOne({ where: { owner, filename } });
  }

  async findById(id: string): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: { id },
      relations: ['owner', 'messages'],
    });
  }

  async addMessage(
    id: string,
    message: string,
    agent: MessageAgent,
  ): Promise<ChatMessage> {
    const chat = await this.chatRepository.findOne({ where: { id } });
    const chatMessage = this.messagesRepository.create({
      chat,
      agent,
      message,
    });
    return this.messagesRepository.save(chatMessage);
  }

  async addMessages(
    id: string,
    messages: { message: string; agent: MessageAgent }[],
  ): Promise<ChatMessage[]> {
    const chat = await this.chatRepository.findOne({ where: { id } });
    const chatMessages = messages.map((m) =>
      this.messagesRepository.create({
        chat,
        agent: m.agent,
        message: m.message,
      }),
    );
    return this.messagesRepository.save(chatMessages);
  }

  async countMessagesByOwner(
    owner: User,
    from: Date,
    to: Date,
  ): Promise<number> {
    return this.messagesRepository.count({
      where: { created_at: Between(from, to), chat: { owner: owner } },
    });
  }

  countDocumentsByOwner(owner: User): Promise<number> {
    return this.chatRepository.count({ where: { owner } });
  }

  deleteMessages(id: string) {
    return this.messagesRepository.delete({ chat: { id } });
  }
}
