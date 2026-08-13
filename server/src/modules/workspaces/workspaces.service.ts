import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    return await this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });
      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });
      return workspace;
    });
  }

  async findAllForUser(userId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      include: { _count: { select: { memberships: true } } },
    });
    return workspaces.map(({ _count, ...workspace }) => ({
      ...workspace,
      memberCount: _count.memberships,
    }));
  }

  async findOne(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }
  async findMembers(workspaceId: string) {
    return await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });
  }
  async inviteMember(
    workspaceId: string,
    invitedById: string,
    email: string,
    role: WorkspaceRole,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    });
    if (!workspace) throw new NotFoundException('Workspace topilmadi');
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new NotFoundException('Bu email bilan foydalanuvchi topilmadi');
    }
    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId },
      },
    });
    if (existing) {
      throw new ConflictException('Bu foydalanuvchi azo bolgan');
    }
    const existingInvitation = await this.prisma.workspaceInvitation.findUnique({
      where: { workspaceId_email: { workspaceId, email: normalizedEmail } },
    });
    if (existingInvitation?.status === 'PENDING') {
      throw new ConflictException('Bu foydalanuvchiga taklif allaqachon yuborilgan');
    }
    const invitation = await this.prisma.workspaceInvitation.upsert({
      where: { workspaceId_email: { workspaceId, email: normalizedEmail } },
      create: { workspaceId, invitedById, email: normalizedEmail, role },
      update: {
        invitedById,
        role,
        status: 'PENDING',
        respondedAt: null,
      },
    });
    await this.prisma.applicationNotification.create({
      data: {
        userId: user.id,
        type: 'WORKSPACE_INVITATION',
        content: `Siz ${workspace.name} workspace’iga ${role.toLowerCase()} sifatida taklif qilindingiz.`,
      },
    });
    return invitation;
  }

  async findPendingInvitations(email: string) {
    return this.prisma.workspaceInvitation.findMany({
      where: { email: email.toLowerCase(), status: 'PENDING' },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptInvitation(invitationId: string, user: { id: string; email: string }) {
    return this.prisma.$transaction(async (tx) => {
      const invitation = await tx.workspaceInvitation.findFirst({
        where: {
          id: invitationId,
          email: user.email.toLowerCase(),
          status: 'PENDING',
        },
      });
      if (!invitation) throw new NotFoundException('Faol taklif topilmadi');

      await tx.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: invitation.workspaceId,
          },
        },
        create: {
          userId: user.id,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        },
        update: { role: invitation.role },
      });
      const acceptedInvitation = await tx.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED', respondedAt: new Date() },
      });
      await tx.applicationNotification.create({
        data: {
          userId: invitation.invitedById,
          type: 'INVITATION_ACCEPTED',
          content: `${user.email} workspace taklifini qabul qildi.`,
        },
      });
      return acceptedInvitation;
    });
  }

  async declineInvitation(invitationId: string, email: string) {
    const invitation = await this.prisma.workspaceInvitation.updateMany({
      where: { id: invitationId, email: email.toLowerCase(), status: 'PENDING' },
      data: { status: 'DECLINED', respondedAt: new Date() },
    });
    if (!invitation.count) throw new NotFoundException('Faol taklif topilmadi');
    return { message: 'Taklif rad etildi' };
  }

  async cancelInvitation(workspaceId: string, invitationId: string) {
    const invitation = await this.prisma.workspaceInvitation.updateMany({
      where: { id: invitationId, workspaceId, status: 'PENDING' },
      data: { status: 'CANCELLED', respondedAt: new Date() },
    });
    if (!invitation.count) throw new NotFoundException('Faol taklif topilmadi');
    return { message: 'Taklif bekor qilindi' };
  }

  async findNotifications(userId: string) {
    return this.prisma.applicationNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async markNotificationRead(notificationId: string, userId: string) {
    const result = await this.prisma.applicationNotification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    if (!result.count) throw new NotFoundException('Xabar topilmadi');
    return { message: 'Xabar o‘qildi' };
  }
  async removeMember(workspaceId: string, memberId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { id: memberId },
    });
    if (!member || member.workspaceId !== workspaceId) {
      throw new NotFoundException('Azo topilmadi');
    }
    if (member.role === 'OWNER') {
      const ownerCount = await this.prisma.workspaceMember.count({
        where: { workspaceId, role: 'OWNER' },
      });
      if (ownerCount <= 1) {
        throw new ForbiddenException(
          'Oxirgi OWNERni workspace dan chiqarib bolmaydi',
        );
      }
    }
    const removed = await this.prisma.workspaceMember.delete({ where: { id: memberId } });
    await this.prisma.applicationNotification.create({
      data: {
        userId: removed.userId,
        type: 'MEMBER_REMOVED',
        content: 'Siz workspace tarkibidan chiqarildingiz.',
      },
    });
    return removed;
  }
}
