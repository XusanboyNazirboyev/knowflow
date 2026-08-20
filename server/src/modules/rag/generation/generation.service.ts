import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';



  interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

@Injectable()
export class GenerationService {
  private readonly client: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY'),
    });
  }



async generateAnswer(question: string, context: string, history: ChatMessage[] = []): Promise<string> {
  const historyText = history
    .map((m) => `${m.role === 'user' ? 'FOYDALANUVCHI' : 'YORDAMCHI'}: ${m.content}`)
    .join('\n');

  const prompt = `Sen — hujjatlar asosida savollarga javob beruvchi yordamchisan.

Quyida, foydalanuvchi hujjatlaridan olingan kontekst berilgan. FAQAT shu kontekst asosida javob ber.
Agar javob kontekstda topilmasa, "Bu haqida hujjatlarda ma'lumot topa olmadim" deb ayt.

${historyText ? `OLDINGI SUHBAT:\n${historyText}\n\n` : ''}KONTEKST:
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
