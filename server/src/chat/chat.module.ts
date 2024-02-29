import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LargeLanguageModelService } from '../infrastructure/llms/large-language-model.service';
import { ChatsService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/messages.entity';

@Module({
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage])],
  providers: [LargeLanguageModelService, ChatsService],
})
export class ChatModule {}
