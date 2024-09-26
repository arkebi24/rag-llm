import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { BraveSearch } from 'langchain/tools';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import { ConfigService } from '@nestjs/config';

interface ProcessRagLlmOptions {
  textChunkSize?: number;
  textChunkOverlap?: number;
  returnLLMResults?: boolean;
  returnSimilaritySearchResults?: boolean;
  numberOfSimilarityResults?: number;
  numberOfPagesToScan?: number;
}

interface NormalizedData {
  title: string;
  link: string;
}

@Injectable()
export class RagLlmService {
  private readonly openai: OpenAI;
  private readonly embeddings: OpenAIEmbeddings;
  private readonly logger = new Logger(RagLlmService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.configService.get<string>('OPENAI_API_KEY') });
    this.embeddings = new OpenAIEmbeddings();
  }

  async processRagLlm(message: string, options: ProcessRagLlmOptions = {}) {
    const {
      textChunkSize = 200,
      textChunkOverlap = 20,
      returnLLMResults = true,
      returnSimilaritySearchResults = true,
      numberOfSimilarityResults = 2,
      numberOfPagesToScan = 2,
    } = options;

    try {
      const sources = await this.searchAndProcessSources(message, textChunkSize, textChunkOverlap, numberOfSimilarityResults, numberOfPagesToScan);
      const content = `Here are the top results from a similarity search: ${JSON.stringify(sources)}. Based on those, and this query "${message}", respond back with an answer ideally in a sentence or two.`;
      const chatCompletion = await this.openai.chat.completions.create({ messages: [{ role: 'user', content }], model: 'gpt-3.5-turbo' });

      return {
        ...(returnLLMResults && { llmResults: chatCompletion.choices }),
        ...(returnSimilaritySearchResults && { similaritySearchResults: sources }),
      };
    } catch (error) {
      this.logger.error(`Error processing RAG LLM: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async rephraseInput(inputString: string): Promise<string> {
    try {
      const gptAnswer = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a rephraser and always respond with a rephrased version of the input that is given to a search engine API. Always be succinct and use the same words as the input.' },
          { role: 'user', content: inputString },
        ],
      });
      return gptAnswer.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error rephrasing input: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async searchAndProcessSources(
    message: string,
    textChunkSize: number,
    textChunkOverlap: number,
    numberOfSimilarityResults: number,
    numberOfPagesToScan: number,
  ) {
    const loader = new BraveSearch({ apiKey: this.configService.get<string>('BRAVE_SEARCH_API_KEY') });
    const rephrasedMessage = await this.rephraseInput(message);
    const docs = await loader.call(rephrasedMessage);
    const normalizedData = this.normalizeData(docs, numberOfPagesToScan);

    const fetchAndProcess = async (item: NormalizedData) => {
      try {
        const htmlContent = await this.fetchPageContent(item.link);
        if (htmlContent.length < 250) return null;
        const splitText = await new RecursiveCharacterTextSplitter({ chunkSize: textChunkSize, chunkOverlap: textChunkOverlap }).splitText(htmlContent);
        const vectorStore = await MemoryVectorStore.fromTexts(splitText, { link: item.link }, this.embeddings);
        return await vectorStore.similaritySearch(message, numberOfSimilarityResults);
      } catch (error) {
        this.logger.warn(`Error processing ${item.link}: ${error.message}`);
        return null;
      }
    };

    const results = await Promise.all(normalizedData.map(fetchAndProcess));
    return results.filter(Boolean);
  }

  private normalizeData(docs: string, numberOfPagesToScan: number): NormalizedData[] {
    return JSON.parse(docs)
      .filter((doc: any) => doc.title && doc.link && !doc.link.includes('brave.com'))
      .slice(0, numberOfPagesToScan)
      .map(({ title, link }: { title: string; link: string }) => ({ title, link }));
  }

  private async fetchPageContent(link: string): Promise<string> {
    try {
      const response = await fetch(link);
      return this.extractMainContent(await response.text(), link);
    } catch (error) {
      this.logger.warn(`Error fetching content from ${link}: ${error.message}`);
      return '';
    }
  }

  private extractMainContent(html: string, link: string): string {
    const $ = cheerio.load(html);
    $('script, style, head, nav, footer, iframe, img').remove();
    return $('body').text().replace(/\s+/g, ' ').trim();
  }
}