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
    // await this.llmService.loadDocuments([
    //   { pageContent: 'juan is a scientist', metadata: { id: 15 } },
    //   { pageContent: 'juan is a dentist', metadata: { id: 16 } },
    // ]);
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
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build(),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    // store file in db
    const f = await this.filesService.create(user, file.originalname);
    const metadata = { filename: file.originalname, owner: user.id, id: f.id };

    // store embedded files with corresponding metadata
    await this.llmService.loadFile(
      new Blob([file.buffer], { type: 'text/plain' }),
      metadata,
      'plain/text',
    );

    // TODO: store file in storage

    return file;
  }

  @Delete('/files/:id')
  async deleteFile(@Param('id') id: string) {
    // TODO: delete file from vector store
    // TODO: delete file from storage

    // delete file from files db
    await this.filesService.delete(id);

    return 'ok';
  }
}
