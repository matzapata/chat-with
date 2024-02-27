import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { LargeLanguageModelService } from './large-language-model.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly llmService: LargeLanguageModelService) {}

  @Post('/')
  async chat(@Body() body: any) {
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
    return 'Messages';
  }

  @Get('/files')
  getChat() {
    return 'Get available files';
  }

  @Post('/files/upload')
  uploadFile() {
    return 'File uploaded';
  }

  @Delete('/files/delete')
  deleteFile() {}
}
