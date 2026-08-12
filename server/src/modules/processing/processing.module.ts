import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentProcessor } from './document.processor';
import { StorageModule } from '@/modules/storage/storage.module';
import { EmbeddingService } from './embedding/embedding.service';
import { GenerationService } from './generation/generation.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: Number(configService.getOrThrow('REDIS_PORT')),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'document-processing',
    }),
    StorageModule,
  ],
  providers: [DocumentProcessor, EmbeddingService, GenerationService],
  exports: [BullModule, EmbeddingService, GenerationService],
})
export class ProcessingModule {}
