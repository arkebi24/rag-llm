import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RagLlmController } from './rag-llm.controller';
import { RagLlmService } from './rag-llm.service';

@Module({
  imports: [ConfigModule],
  controllers: [RagLlmController],
  providers: [RagLlmService],
})
export class RagLlmModule {}