import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { BraveSearch } from 'langchain/tools';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

@Injectable()
export class RagLlmService {
  private openai: OpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.embeddings = new OpenAIEmbeddings();
  }

  async processRagLlm(
    message: string,
    textChunkSize = 200,
    textChunkOverlap = 20,
    returnLLMResults = true,
    returnSimilaritySearchResults = true,
    numberOfSimilarityResults = 2,
    numberOfPagesToScan = 2,
  ) {
    const sources = await this.searchEngineForSources(message, textChunkSize, textChunkOverlap, numberOfSimilarityResults, numberOfPagesToScan);
    const content = `Here are the top results from a similarity search: ${JSON.stringify(sources)}. Based on those, and this query "${message}", respond back with an answer ideally in a sentence or two.`;
    const chatCompletion = await this.openai.chat.completions.create({ messages: [{ role: 'user', content }], model: 'gpt-3.5-turbo' });

    let responseObj: any = {};
    if (returnLLMResults) responseObj.llmResults = chatCompletion.choices;
    if (returnSimilaritySearchResults) responseObj.similaritySearchResults = sources;

    return responseObj;
  }

  private async rephraseInput(inputString: string): Promise<string> {
    const gptAnswer = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a rephraser and always respond with a rephrased version of the input that is given to a search engine API. Always be succint and use the same words as the input.' },
        { role: 'user', content: inputString },
      ],
    });
    return gptAnswer.choices[0].message.content;
  }

  private async searchEngineForSources(
    message: string,
    textChunkSize: number,
    textChunkOverlap: number,
    numberOfSimilarityResults: number,
    numberOfPagesToScan: number,
  ) {
    const loader = new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY });
    const rephrasedMessage = await this.rephraseInput(message);
    const docs = await loader.call(rephrasedMessage);
    const normalizedData = this.normalizeData(docs, numberOfPagesToScan);

    const fetchAndProcess = async (item) => {
      const htmlContent = await this.fetchPageContent(item.link);
      if (htmlContent.length < 250) return null;
      const splitText = await new RecursiveCharacterTextSplitter({ chunkSize: textChunkSize, chunkOverlap: textChunkOverlap }).splitText(htmlContent);
      const vectorStore = await MemoryVectorStore.fromTexts(splitText, { link: item.link }, this.embeddings);
      return await vectorStore.similaritySearch(message, numberOfSimilarityResults);
    };

    return await Promise.all(normalizedData.map(fetchAndProcess));
  }

  private normalizeData(docs: string, numberOfPagesToScan: number) {
    return JSON.parse(docs)
      .filter((doc) => doc.title && doc.link && !doc.link.includes('brave.com'))
      .slice(0, numberOfPagesToScan)
      .map(({ title, link }) => ({ title, link }));
  }

  private async fetchPageContent(link: string): Promise<string> {
    const response = await fetch(link);
    return this.extractMainContent(await response.text(), link);
  }

  private extractMainContent(html: string, link: string): string {
    const $ = cheerio.load(html);
    $('script, style, head, nav, footer, iframe, img').remove();
    return $('body').text().replace(/\s+/g, ' ').trim();
  }
}