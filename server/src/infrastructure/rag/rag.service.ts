import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from 'langchain/document';
import { OpenAI } from '@langchain/openai';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnablePassthrough, RunnableSequence } from 'langchain/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { AIMessage, HumanMessage } from 'langchain/schema';

export enum MessageAgent {
  user = 'USER',
  ai = 'AI',
}

export enum MimeType {
  pdf = 'application/pdf',
  text = 'text/plain',
  json = 'application/json',
  csv = 'text/csv',
}

@Injectable()
export class RetrievalAugmentedGenerationService {
  private vectorStore: SupabaseVectorStore;
  private llm: OpenAI;

  constructor(private readonly configService: ConfigService) {
    // Initialize the vector store
    this.vectorStore = new SupabaseVectorStore(
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

    // Initialize the language model
    this.llm = new OpenAI({
      modelName: 'gpt-3.5-turbo-0613',
      temperature: 0.8,
      openAIApiKey: this.configService.get('OPENAI_API_KEY'),
      // streaming: true, // TODO:
    });
  }

  // ===== ai prompting functions =====

  public async invoke(
    query: string,
    chat_history: { agent: MessageAgent; message: string }[],
    k: number,
    filter: any,
  ) {
    return this.buildRagChain(k, filter).invoke({
      question: query,
      chat_history: chat_history.map((m) =>
        m.agent == MessageAgent.ai
          ? new AIMessage(m.message)
          : new HumanMessage(m.message),
      ),
    });
  }

  private buildRagChain(k: number, filter: any) {
    // use ai to contextualize the question in case it needs chat history
    const contextualizeQSystemPrompt = `Given a chat history and the latest user question
    which might reference context in the chat history, formulate a standalone question
    which can be understood without the chat history. Do NOT answer the question,
    just reformulate it if needed and otherwise return it as is.`;

    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
      ['system', contextualizeQSystemPrompt],
      new MessagesPlaceholder('chat_history'),
      ['human', '{question}'],
    ]);
    const contextualizeQChain = contextualizeQPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

    const qaPrompt = ChatPromptTemplate.fromMessages([
      ['system', qaSystemPrompt],
      new MessagesPlaceholder('chat_history'),
      ['human', '{question}'],
    ]);

    const contextualizedQuestion = (input: Record<string, unknown>): any => {
      if ('chat_history' in input) {
        return contextualizeQChain;
      }
      return input.question;
    };

    // use the vector store to retrieve documents with the specified filter
    const retriever = this.vectorStore.asRetriever(k, filter);

    // create the RAG chain. Checks if chat history is present, if so, contextualizes the question
    const ragChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        context: (input: Record<string, unknown>) => {
          if ('chat_history' in input) {
            const chain = contextualizedQuestion(input);
            return chain.pipe(retriever).pipe(formatDocumentsAsString);
          }
          return '';
        },
      }),
      qaPrompt,
      this.llm,
    ]);

    return ragChain;
  }

  // ===== vector store functions =====

  public async similaritySearch(query: string, k: number, filter?: any) {
    return this.vectorStore.similaritySearch(query, k, filter);
  }

  public async loadDocuments(
    documents: {
      pageContent: string;
      metadata: Record<string, any>;
    }[],
  ): Promise<string[]> {
    // returns ids of the added documents
    return this.vectorStore.addDocuments(documents);
  }

  public async deleteDocuments(ids: string[]) {
    return this.vectorStore.delete({ ids });
  }

  public async loadFile(
    filePathOrBlob: string | Blob,
    mimetype: MimeType,
    metadata?: Record<string, any>,
  ) {
    // Load file content
    let contents: Document<Record<string, any>>[] = [];
    switch (mimetype) {
      case MimeType.text: {
        const loader = new TextLoader(filePathOrBlob);
        contents = await loader.load();
        break;
      }
      case MimeType.json: {
        const loader = new JSONLoader(filePathOrBlob);
        contents = await loader.load();
        break;
      }
      case MimeType.pdf: {
        const loader = new PDFLoader(filePathOrBlob);
        contents = await loader.load();
        break;
      }
      case MimeType.csv: {
        const loader = new CSVLoader(filePathOrBlob);
        contents = await loader.load();
        break;
      }
      default:
        throw new Error('Unsupported file type' + mimetype);
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
