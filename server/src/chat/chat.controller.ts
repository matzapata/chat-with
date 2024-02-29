import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LargeLanguageModelService } from '../infrastructure/llms/large-language-model.service';
import { ChatDto } from './dtos/chat.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './services/files.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FileDto } from './dtos/file.dto';

@Controller('api/chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly llmService: LargeLanguageModelService,
    private readonly filesService: FilesService,
  ) {}

  @Post('/')
  async chat(@Body() body: ChatDto, @CurrentUser() user: User) {
    // chat logic, query and retrieval
    // const res = await this.llmService.invoke('who is juan?', '', 5, { id: 1 });
    // const res = await this.llmService.loadDocuments([
    //   { pageContent: 'juan is a scientist', metadata: { id: 15 } },
    //   { pageContent: 'juan is a dentist', metadata: { id: 16 } },
    // ]);
    // const res = await this.llmService.deleteDocuments(['11', '12']);

    // const resc = await this.llmService.similaritySearch('who is juan?', 2, {
    //   id: 15,
    // });
    // console.log(JSON.stringify(resc));
    const res = await this.llmService.invoke(body.query, 2, {
      filename: body.filename,
      owner: user.id,
    });

    return JSON.stringify(res);
  }

  @Get('/history')
  getMessages() {
    // get chat history
    throw new Error('Not implemented');
  }

  @Get('/files')
  @Serialize(FileDto)
  async getFiles(@CurrentUser() user: User) {
    return this.filesService.findAllOwnedBy(user);
  }

  @Post('/files')
  @Serialize(FileDto)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
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
    // store embedded files with corresponding metadata
    const embeddingsIds = await this.llmService.loadFile(
      new Blob([file.buffer], { type: file.mimetype }),
      file.mimetype,
      { filename: file.originalname, owner: user.id },
    );

    // store file in db
    const f = await this.filesService.create(
      user,
      file.originalname,
      embeddingsIds,
    );

    // TODO: store file in storage

    return f;
  }

  @Delete('/files/:id')
  async deleteFile(@Param('id') id: string) {
    const file = await this.filesService.findById(id);

    // delete file from vector store
    await this.llmService.deleteDocuments(file.embeddings_ids);

    // TODO: delete file from storage

    // delete file from files db
    await this.filesService.delete(id);

    return file;
  }
}
