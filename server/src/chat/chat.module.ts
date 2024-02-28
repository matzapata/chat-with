import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LargeLanguageModelService } from '../infrastructure/llms/large-language-model.service';
import { FilesService } from './services/files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/files.entity';

@Module({
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([File])],
  providers: [LargeLanguageModelService, FilesService],
})
export class ChatModule {}
