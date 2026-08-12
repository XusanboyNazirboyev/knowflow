import { Module } from '@nestjs/common';
import { StorageModule } from '@/modules/storage/storage.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [StorageModule, BullModule.registerQueue({name:'document-processing'})],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
