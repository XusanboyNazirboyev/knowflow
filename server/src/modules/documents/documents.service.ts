import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}
  async create(workspaceId: string, file: Express.Multer.File) {
    const key = `${workspaceId}/${randomUUID()}-${file.originalname}`;
    await this.storageService.uploadFile(key, file.buffer, file.mimetype);
    return this.prisma.document.create({
      data: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        storageKey: key,
        status: 'PENDING',
        workspaceId,
      },
    });
  }
  async findAllForWorkspace(workspaceId: string) {
    return await this.prisma.document.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document || document.workspaceId !== workspaceId) {
      throw new NotFoundException('Hujjat topilmadi');
    }
    return document;
  }
  async getDownloadUrl(workspaceId: string, id: string) {
    const document = await this.findOne(workspaceId, id);
    const url = await this.storageService.getSignedDownloadUrl(
      document.storageKey,
    );
    return { url, fileName: document.fileName };
  }
}
