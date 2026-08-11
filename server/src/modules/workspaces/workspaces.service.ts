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
    return await this.prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
    });
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
  async inviteMember(workspaceId: string, email: string, role: WorkspaceRole) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found on this email');
    }
    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId },
      },
    });
    if (existing) {
      throw new ConflictException('Bu foydalanuvchi azo bolgan');
    }
    return this.prisma.workspaceMember.create({
      data: { userId: user.id, workspaceId, role },
    });
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
    return this.prisma.workspaceMember.delete({ where: { id: memberId } });
  }
}
