import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LargeLanguageModelService } from './large-language-model.service';

@Module({
  controllers: [ChatController],
  providers: [LargeLanguageModelService],
})
export class ChatModule {}
