import { Injectable } from '@nestjs/common';
import { EmbeddingService } from '../../processing/embedding/embedding.service';
import { PrismaService } from '@/database/prisma/prisma.service';
import { SearchOptions, SearchResult } from '../search.types';

@Injectable()
export class VectorRetriever {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly prisma: PrismaService,
  ) {}

  async retrieve(
    query: string,
    workspaceId: string,
    options: SearchOptions = {},
  ): Promise<SearchResult[]> {
    const limit = options.limit ?? 10;

    const embedding = await this.embeddingService.embedText(query);

    const vector = `[${embedding.join(',')}]`;

    const results = await this.prisma.$queryRaw<SearchResult[]>`
      SELECT
        dc.id,
        dc.content,
        dc."chunkIndex",
        dc."documentId",
        d."fileName",
        1 - (dc.embedding <=> ${vector}::vector) AS score
      FROM document_chunks dc
      INNER JOIN documents d
        ON d.id = dc."documentId"
      WHERE d."workspaceId" = ${workspaceId}
        AND d.status = 'READY'
        AND dc.embedding IS NOT NULL
      ORDER BY dc.embedding <=> ${vector}::vector
      LIMIT ${limit}
    `;

    return results;
  }
}
