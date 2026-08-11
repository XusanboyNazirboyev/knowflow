import { PrismaService } from "@/database/prisma/prisma.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma:PrismaService){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req =  context.switchToHttp().getRequest()
    const user =  req.user
    const workspaceId =  req.params.workspaceId ?? req.params.id

    if(!workspaceId){
      throw new ForbiddenException('Workspace id not found')
    }
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException("Bu workspace'ga kirish huquqingiz yo'q");
    }

    req.membership = membership;
    return true;
  }
}