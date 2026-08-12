import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('workspaces/:workspaceId/chat')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  sendMessage(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: SendMessageDto,
    @Query('conversationId') conversationId?: string,
  ) {
    return this.chatService.sendMessage(
      workspaceId,
      conversationId,
      dto.content,
    );
  }
  @Get('conversations')
  listConversations(@Param('workspaceId') workspaceId: string) {
    return this.chatService.listConversations(workspaceId);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }
}
