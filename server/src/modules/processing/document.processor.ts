import { PrismaService } from '@/database/prisma/prisma.service';
import { StorageService } from '@/modules/storage/storage.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { PDFParse } from 'pdf-parse';
import { chunkText } from './chunk/chunking.utils';
import { EmbeddingService } from './embedding/embedding.service';
import { randomUUID } from 'node:crypto';

@Processor('document-processing')
@Injectable()
export class DocumentProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly embeddingService: EmbeddingService,
  ) {
    super();
  }
  async process(job: Job<{ documentId: string }>): Promise<void> {
    const { documentId } = job.data;

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException(`Hujjat topilmadi ${documentId}`);
    }

    const fileBuffer = await this.storageService.getFileBuffer(
      document.storageKey,
    );

    const extractedText = await this.extractText(fileBuffer, document.mimeType);

    const chunks = chunkText(extractedText);

    console.log(`Jami ${chunks.length} ta chunk, embedding boshlanmoqda...`);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await this.embeddingService.embedText(chunks[i]);
      const vectorLiteral = `[${embedding.join(',')}]`;

      await this.prisma.$executeRaw`
    INSERT INTO document_chunks (id, content, "chunkIndex", "documentId", embedding)
    VALUES (${randomUUID()}, ${chunks[i]}, ${i}, ${documentId}, ${vectorLiteral}::vector)
  `;
      console.log(`Chunk ${i + 1}/${chunks.length} saqlandi`);
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'READY' },
    });
  }
  private async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === 'application/pdf') {
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        return result.text;
      } finally {
        await parser.destroy();
      }
    }

    if (mimeType === 'text/plain') {
      return buffer.toString('utf-8');
    }

    throw new Error(`Qo'llab-quvvatlanmaydigan fayl turi: ${mimeType}`);
  }
}
