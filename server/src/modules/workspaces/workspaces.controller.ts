import { Controller, Post, Body, UseGuards, Get, Param, Delete, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import { WorkspaceRole } from '@prisma/client';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateWorkspaceDto,
  ) {
    return await this.workspacesService.create(user.id, dto);
  }
  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return await this.workspacesService.findAllForUser(user.id);
  }
  @Get('invitations/mine')
  async findMyInvitations(@CurrentUser() user: { email: string }) {
    return this.workspacesService.findPendingInvitations(user.email);
  }

  @Get('notifications')
  findNotifications(@CurrentUser() user: { id: string }) {
    return this.workspacesService.findNotifications(user.id);
  }

  @Patch('notifications/:notificationId/read')
  markNotificationRead(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.workspacesService.markNotificationRead(notificationId, user.id);
  }

  @Post('invitations/:invitationId/accept')
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.workspacesService.acceptInvitation(invitationId, user);
  }

  @Post('invitations/:invitationId/decline')
  async declineInvitation(
    @Param('invitationId') invitationId: string,
    @CurrentUser() user: { email: string },
  ) {
    return this.workspacesService.declineInvitation(invitationId, user.email);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async findOne(@Param('id') id: string) {
    return await this.workspacesService.findOne(id);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async findMembers(@Param('id') id: string) {
    return await this.workspacesService.findMembers(id);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async inviteMember(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: InviteMemberDto,
  ) {
    return await this.workspacesService.inviteMember(
      id,
      user.id,
      dto.email,
      dto.role,
    );
  }

  @Delete(':id/invitations/:invitationId')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  cancelInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.workspacesService.cancelInvitation(id, invitationId);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.workspacesService.removeMember(id, memberId);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @UsePipes(new ValidationPipe({ disableErrorMessages: false }))
  async update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return await this.workspacesService.update(id, dto);
  }

  // workspaces.controller.ts fayliga qo'shing:

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER') // Faqat OWNER workspace'ni o'chira olishi uchun
  async deleteWorkspace(@Param('id') id: string) {
    return await this.workspacesService.deleteWorkspace(id);
  }
}
