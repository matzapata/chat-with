import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  RetrievalAugmentedGenerationService,
  MessageAgent,
} from '../infrastructure/rag/rag.service';
import { PostMessageDto } from './dtos/post-message.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatsService } from './services/chat.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChatMetadataDto } from './dtos/chat-metadata.dto';
import { ChatDto } from './dtos/chat.dto';
import { StorageService } from 'src/infrastructure/storage/storage.service';

// One chat conversation per file. so files and chats are associated
// TODO: Require subscription to use this endpoint

@Controller('api/chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly ragService: RetrievalAugmentedGenerationService,
    private readonly chatsService: ChatsService,
    private readonly storageService: StorageService,
  ) {}

  @Get('/')
  @Serialize(ChatMetadataDto)
  getChats(@CurrentUser() user: User) {
    return this.chatsService.findAllOwnedBy(user);
  }

  @Post('/')
  @Serialize(ChatMetadataDto)
  @UseInterceptors(FileInterceptor('file'))
  async createChat(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /(application\/json|application\/pdf|text\/csv|text\/plain)/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build(),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    // Check if there's already a chat for the file
    const existingChat = await this.chatsService.findFileForOwner(
      user,
      file.originalname,
    );
    if (existingChat) {
      throw new BadRequestException('Chat already exists for this file');
    }

    // store embedded files with corresponding metadata
    const embeddingsIds = await this.ragService.loadFile(
      new Blob([file.buffer], { type: file.mimetype }),
      file.mimetype,
      { filename: file.originalname, owner: user.id },
    );

    // store file in db
    const chat = await this.chatsService.create(
      user,
      file.originalname,
      embeddingsIds,
    );

    // store file in storage
    await this.storageService.uploadFile(
      `${user.id}/${chat.id}-${file.originalname}`,
      file.buffer,
    );

    return chat;
  }

  @Delete('/:id')
  async deleteChat(@Param('id') id: string) {
    const chat = await this.chatsService.findById(id);

    // delete file from vector store
    await this.ragService.deleteDocuments(chat.embeddings_ids);

    // delete file from storage
    await this.storageService.deleteFile(
      `${chat.owner.id}/${chat.id}-${chat.filename}`,
    );

    // delete file from files db
    await this.chatsService.delete(id);

    return chat;
  }

  @Put('/:id')
  async postMessage(
    @Body() body: PostMessageDto,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    // Check user has permissions
    const chat = await this.chatsService.findById(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (chat.owner.id !== user.id) {
      throw new ForbiddenException('Not allowed');
    }

    // Create response
    const res = await this.ragService.invoke(
      body.message,
      chat.messages.map((m) => ({ agent: m.agent, message: m.message })),
      2,
      { filename: chat.filename, owner: user.id },
    );

    // Add user and ai message to chat
    const userMessage = await this.chatsService.addMessage(
      id,
      body.message,
      MessageAgent.user,
    );

    // Add ai message to chat
    const aiMessage = await this.chatsService.addMessage(
      id,
      res,
      MessageAgent.ai,
    );

    return { userMessage, aiMessage };
  }

  @Get('/:id')
  @Serialize(ChatDto)
  async getChat(@Param('id') id: string) {
    const chat = this.chatsService.findById(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }
}
