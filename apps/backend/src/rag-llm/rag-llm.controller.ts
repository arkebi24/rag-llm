import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RagLlmService } from './rag-llm.service';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

class ProcessRagLlmDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(1000)
  textChunkSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  textChunkOverlap?: number;

  @IsOptional()
  @IsBoolean()
  returnLLMResults?: boolean;

  @IsOptional()
  @IsBoolean()
  returnSimilaritySearchResults?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  numberOfSimilarityResults?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  numberOfPagesToScan?: number;
}

@Controller('rag-llm')
export class RagLlmController {
  constructor(private readonly ragLlmService: RagLlmService) {}

  @Post()
  async processRagLlm(@Body() body: ProcessRagLlmDto) {
    try {
      const {
        message,
        textChunkSize,
        textChunkOverlap,
        returnLLMResults,
        returnSimilaritySearchResults,
        numberOfSimilarityResults,
        numberOfPagesToScan,
      } = body;

      return await this.ragLlmService.processRagLlm(message, {
        textChunkSize,
        textChunkOverlap,
        returnLLMResults,
        returnSimilaritySearchResults,
        numberOfSimilarityResults,
        numberOfPagesToScan,
      });
    } catch (error) {
      throw new HttpException('Error processing RAG LLM', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}