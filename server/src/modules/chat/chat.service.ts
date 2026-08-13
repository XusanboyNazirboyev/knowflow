import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { GenerationService } from '../processing/generation/generation.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService,
    private readonly generationService: GenerationService,
    
  ) {
  }

  
  async sendMessage(
    workspaceId: string,
    conversationId: string | undefined,
    content: string,
  ) {
    let conversation = conversationId
      ? await this.prisma.conversation.findFirst({
          where: { id: conversationId, workspaceId },
        })
      : null;

    if (conversationId && !conversation) {
      throw new NotFoundException('Suhbat topilmadi');
    }

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          workspaceId,
          title: content.slice(0, 50),
        },
      });
    }
    
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content,
      },
    });
    const searchResults = await this.searchService.searchWorkspace(
      workspaceId,
      content,
    );
    const context = searchResults
      .map((r, i) => `[${i + 1}] (${r.fileName})\n${r.content}`)
      .join('\n\n');
    const answer = await this.generationService.generateAnswer(
      content,
      context,
    );
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: answer,
      },
    });
    return {
      conversationId: conversation.id,
      message: assistantMessage,
      sources: searchResults.map((r) => ({
        fileName: r.fileName,
        documentId: r.documentId,
        similarity: r.similarity,
      })),
    };
  }
  async createConversation(workspaceId: string, title?: string) {
    return this.prisma.conversation.create({
      data: { workspaceId, title: title?.trim() || 'Yangi suhbat' },
    });
  }
  async getConversation(workspaceId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('Suhbat topilmadi');
    return conversation;
  }
  async listConversations(workspaceId: string) {
    return this.prisma.conversation.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
