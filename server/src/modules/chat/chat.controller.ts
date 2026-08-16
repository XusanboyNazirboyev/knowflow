import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('workspaces/:workspaceId/chat')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  sendMessage(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
    @Body() dto: SendMessageDto,
    @Query('conversationId') conversationId?: string,
  ) {
    return this.chatService.sendMessage(
      workspaceId,
      user.id,
      conversationId,
      dto.content,
    );
  }

  @Post('conversations')
  createConversation(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(workspaceId, user.id, dto.title);
  }

  @Get('conversations')
  listConversations(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.chatService.listConversations(workspaceId, user.id);
  }

  @Get('conversations/:id')
  getConversation(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.chatService.getConversation(workspaceId, user.id, id);
  }
  @Patch('conversations/:id')
  updateConversation(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
    @Param('id') conversationId: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.chatService.updateConversation(
      workspaceId,
      user.id,
      conversationId,
      dto.title,
    );
  }

  @Delete('conversations/:id')
  deleteConversation(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.deleteConversation(
      workspaceId,
      user.id,
      conversationId,
    );
  }
}
