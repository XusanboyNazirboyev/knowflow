import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenat.guard';
import { SearchService } from './search.service';

@Controller('workspaces/:workspaceId/search')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
   search(
    @Param('workspaceId') workspaceId: string,
    @Body('query') query: string,
  ) {
    return this.searchService.searchWorkspace(workspaceId, query);
  }
}
