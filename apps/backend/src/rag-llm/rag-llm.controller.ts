import { Controller, Post, Body } from '@nestjs/common';
import { RagLlmService } from './rag-llm.service';

@Controller('rag-llm')
export class RagLlmController {
  constructor(private readonly ragLlmService: RagLlmService) {}

  @Post()
  async processRagLlm(@Body() body: any) {
    const {
      message,
      textChunkSize = 200,
      textChunkOverlap = 20,
      returnLLMResults = true,
      returnSimilaritySearchResults = true,
      numberOfSimilarityResults = 2,
      numberOfPagesToScan = 4,
    } = body;

    return this.ragLlmService.processRagLlm(
      message,
      textChunkSize,
      textChunkOverlap,
      returnLLMResults,
      returnSimilaritySearchResults,
      numberOfSimilarityResults,
      numberOfPagesToScan,
    );
  }
}