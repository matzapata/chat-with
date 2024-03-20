import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { RetrievalAugmentedGenerationService } from './services/rag.service';
import { ChatsService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/messages.entity';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { PlanCheckerService } from 'src/payments/services/plan-checker.service';
import { VectorStoreService } from 'src/infrastructure/vectorstore/vectorstore.service';
import { LlmService } from 'src/infrastructure/llm/llm.service';

@Module({
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage]), PaymentsModule],
  providers: [
    RetrievalAugmentedGenerationService,
    VectorStoreService,
    LlmService,
    ChatsService,
    StorageService,
    PlanCheckerService,
  ],
})
export class ChatModule {}
