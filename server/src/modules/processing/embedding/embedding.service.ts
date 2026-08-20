import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class EmbeddingService {
  private readonly client: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY'),
    });
  }

  async embedText(text: string, retries = 3): Promise<number[]> {
    try {
      const response = await this.client.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: { outputDimensionality: 1536 },
      });

      const embedding = response.embeddings?.[0]?.values;
      if (!embedding) {
        throw new Error('Gemini embedding qaytarmadi');
      }
      return embedding;
    } catch (error: any) {
      if (error.status === 429 && retries > 0) {
        console.warn(
          `Rate limit — 5 soniya kutib, qayta urinilmoqda (${retries} qoldi)`,
        );
        await sleep(5000);
        return this.embedText(text, retries - 1);
      }
      throw error;
    }
  }
  async embedBatch(texts: string[], retries = 3): Promise<number[][]> {
    try {
      const response = await this.client.models.embedContent({
        model: 'gemini-embedding-001',
        contents: texts,
        config: { outputDimensionality: 1536 },
      });

      const embeddings = response.embeddings?.map((e) => e.values);
      if (!embeddings || embeddings.some((e) => !e)) {
        throw new Error("Gemini, ba'zi embedding'larni qaytarmadi");
      }
      return embeddings as number[][];
    } catch (error: any) {
      if (error.status === 429 && retries > 0) {
        await new Promise((r) => setTimeout(r, 5000));
        return this.embedBatch(texts, retries - 1);
      }
      throw error;
    }
  }
}
