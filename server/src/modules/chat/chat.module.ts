import { Module } from '@nestjs/common';
import { ProcessingModule } from '@/modules/processing/processing.module';
import { SearchModule } from '@/modules/search/search.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ProcessingModule, SearchModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
