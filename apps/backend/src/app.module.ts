import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RagLlmModule } from './rag-llm/rag-llm.module';

@Module({
  imports: [RagLlmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
