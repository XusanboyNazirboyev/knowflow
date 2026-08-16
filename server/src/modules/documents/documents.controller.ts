import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileTypeValidator } from './custom.validator';

@Controller('workspaces/:workspaceId/documents')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DocumentsController {
  constructor(private readonly docService: DocumentsService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('workspaceId') workspaceId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
          new CustomFileTypeValidator()
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.docService.create(workspaceId, file);
  }

  @Get()
  async findAll(@Param('workspaceId') workspaceId: string) {
    return await this.docService.findAllForWorkspace(workspaceId);
  }

  @Get(':id')
  async finOne(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return await this.docService.findOne(workspaceId, id);
  }
  @Get(':id/download-url')
  getDownloadUrl(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.docService.getDownloadUrl(workspaceId, id);
  }
  @Delete(':id')
  remove(@Param('workspaceId') workspaceId: string, @Param('id') id: string) {
    return this.docService.remove(workspaceId, id);
  }
}
