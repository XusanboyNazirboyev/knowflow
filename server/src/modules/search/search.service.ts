import { PrismaService } from '@/database/prisma/prisma.service';
import { EmbeddingService } from '@/modules/processing/embedding/embedding.service';
import { Injectable } from '@nestjs/common';

export interface SearchResult {
  id: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  fileName: string;
  similarity: number;
}
@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}
  async searchWorkspace(workspaceId: string, query: string, limit = 5) {
    const queryEmbedding = await this.embeddingService.embedText(query);
    const vectorLiteral = `[${queryEmbedding.join(',')}]`;
    const results = await this.prisma.$queryRaw<SearchResult[]>`
      SELECT
        dc.id,
        dc.content,
        dc."chunkIndex",
        dc."documentId",
        d."fileName",
        1 - (dc.embedding <=> ${vectorLiteral}::vector) as similarity
      FROM document_chunks dc
      JOIN documents d ON d.id = dc."documentId"
      WHERE d."workspaceId" = ${workspaceId}
      ORDER BY dc.embedding <=> ${vectorLiteral}::vector
      LIMIT ${limit}
    `;
    return results;
  }
}
