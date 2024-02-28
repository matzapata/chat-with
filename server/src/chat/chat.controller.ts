import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LargeLanguageModelService } from './large-language-model.service';
import { ChatDto } from './dtos/chat.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { FilesService } from './services/files.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('api/chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly llmService: LargeLanguageModelService,
    private readonly filesService: FilesService,
  ) {}

  @Post('/')
  async chat(@Body() body: ChatDto) {
    // chat logic, query and retrieval
    // const res = await this.llmService.invoke('who is juan?', '', 5, { id: 1 });
    // await this.llmService.loadDocuments([
    //   { pageContent: 'juan is a scientist', metadata: { id: 15 } },
    //   { pageContent: 'juan is a dentist', metadata: { id: 16 } },
    // ]);
    // const resc = await this.llmService.similaritySearch('who is juan?', 2, {
    //   id: 15,
    // });
    // console.log(JSON.stringify(resc));
    const res = await this.llmService.invoke(body.query, 2, {
      id: 15,
    });

    return JSON.stringify(res);
  }

  @Get('/history')
  getMessages() {
    // get chat history

    return 'Messages';
  }

  @Get('/files')
  async getFiles(@CurrentUser() user: User) {
    // TODO: serialize
    return this.filesService.findAllOwnedBy(user);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/files')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    // store embedded files with corresponding metadata
    // also store file in db and in storage

    const loader = new TextLoader(
      new Blob([file.buffer], { type: 'text/plain' }),
      // 'src/document_loaders/example_data/example.txt',
    );

    // await this.filesService.create(file.originalname, loader);

    return await loader.load();
  }

  @Delete('/files/:id')
  async deleteFile(@Param('id') id: string) {
    // delete file from dbs and storage
    await this.filesService.delete(id);

    return 'ok';
  }
}
