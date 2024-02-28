import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'langchain/llms/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from 'langchain/document';

@Injectable()
export class LargeLanguageModelService {
  private static vectorStore: SupabaseVectorStore;
  private static llm: OpenAI;

  constructor(private readonly configService: ConfigService) {
    // Initialize the vector store
    if (!LargeLanguageModelService.vectorStore) {
      LargeLanguageModelService.vectorStore = new SupabaseVectorStore(
        new OpenAIEmbeddings({
          openAIApiKey: this.configService.get('OPENAI_API_KEY'),
        }),
        {
          client: supabaseCreateClient(
            this.configService.get('SUPABASE_URL'),
            this.configService.get('SUPABASE_SECRET'),
          ),
          tableName: 'documents',
        },
      );
    }
    // Initialize the language model
    if (!LargeLanguageModelService.llm) {
      LargeLanguageModelService.llm = new OpenAI({
        modelName: 'gpt-3.5-turbo-0613',
        temperature: 0.8,
        openAIApiKey: this.configService.get('OPENAI_API_KEY'),
        // streaming: true, // TODO:
      });
    }
  }

  public async invoke(query: string, k: number, filter: any) {
    const context = await this.similaritySearch(query, k, filter);
    const text = await LargeLanguageModelService.llm.invoke(
      `Context information is below. \n---------------------\n${context.map((c) => c.pageContent + '\n')}\n---------------------\nGiven the context information and no prior knowledge, answer the question: ${query}`,
    );
    return {
      text,
      context,
    };
  }

  public async similaritySearch(query: string, k: number, filter?: any) {
    return LargeLanguageModelService.vectorStore.similaritySearch(
      query,
      k,
      filter,
    );
  }

  public async loadDocuments(
    documents: {
      pageContent: string;
      metadata: Record<string, any>;
    }[],
  ) {
    return LargeLanguageModelService.vectorStore.addDocuments(documents);
  }

  public async deleteDocuments(ids: string[]) {
    throw new Error('Not implemented');
    // return LargeLanguageModelService.vectorStore.deleteDocuments(ids);
  }

  public async loadFile(
    filePathOrBlob: string | Blob,
    metadata: Record<string, any>,
    type: 'plain/text' | 'others',
  ) {
    // Load file content
    let contents: Document<Record<string, any>>[] = [];
    switch (type) {
      case 'plain/text':
        const loader = new TextLoader(filePathOrBlob);
        contents = await loader.load();
        break;
      default:
        throw new Error('Unsupported file type');
    }

    // merge metadata
    const documents = contents.map((d) => ({
      pageContent: d.pageContent,
      metadata: {
        ...d.metadata,
        ...metadata,
      },
    }));

    return this.loadDocuments(documents);
  }
}
