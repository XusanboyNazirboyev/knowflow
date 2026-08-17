import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GenerationService {
  private readonly client: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY'),
    });
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    const prompt = `Sen — hujjatlar asosida savollarga javob beruvchi yordamchisan.

Quyida, foydalanuvchi hujjatlaridan olingan kontekst berilgan. FAQAT shu kontekst asosida javob ber.
Agar javob kontekstda topilmasa, "Bu haqida hujjatlarda ma'lumot topa olmadim" deb ayt — hech qachon o'zingdan taxmin qilib javob berma.

KONTEKST:
${context}

SAVOL: ${question}

JAVOB:`;

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text ?? "Javob generatsiya qilib bo'lmadi.";
  }
}
