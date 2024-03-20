import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnablePassthrough, RunnableSequence } from 'langchain/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { VectorStoreService } from '../../infrastructure/vectorstore/vectorstore.service';
import { LlmService } from '../../infrastructure/llm/llm.service';
import { MimeType } from 'src/infrastructure/vectorstore/vectorstore.service';

export enum MessageAgent {
  user = 'USER',
  ai = 'AI',
}

@Injectable()
export class RetrievalAugmentedGenerationService {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly llmService: LlmService,
  ) {}

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
      .pipe(this.llmService.llm)
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
    const retriever = this.vectorStoreService.getRetriever(k, filter);

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
      this.llmService.llm,
    ]);

    return ragChain;
  }

  public async loadFile(
    file: Blob,
    mimetype: MimeType,
    metadata: any,
  ): Promise<string[]> {
    return this.vectorStoreService.loadFile(file, mimetype, metadata);
  }

  public async deleteDocuments(ids: string[]) {
    return this.vectorStoreService.deleteDocuments(ids);
  }
}
