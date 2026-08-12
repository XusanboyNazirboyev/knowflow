import { Module } from '@nestjs/common';
import { ProcessingModule } from '@/modules/processing/processing.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ProcessingModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports:[SearchService]

})
export class SearchModule {}
