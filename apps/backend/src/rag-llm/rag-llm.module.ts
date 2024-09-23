import { Module } from '@nestjs/common';
import { RagLlmController } from './rag-llm.controller';
import { RagLlmService } from './rag-llm.service';

@Module({
  controllers: [RagLlmController],
  providers: [RagLlmService],
})
export class RagLlmModule {}