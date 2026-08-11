import { Controller, Post, Body, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import { WorkspaceRole } from '@prisma/client';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
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
    @Body() dto: { email: string; role: WorkspaceRole },
  ) {
    return await this.workspacesService.inviteMember(id, dto.email, dto.role);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.workspacesService.removeMember(id, memberId);
  }
}
