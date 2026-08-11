import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WorkspaceRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requestRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if(!requestRoles || requestRoles.length == 0){
      return true
    }
    const req = context.switchToHttp().getRequest()
    const membership = req.membership

    if(!membership || !requestRoles.includes(membership.role)){
      throw new ForbiddenException('Bu amal uchun huquqingiz yoq')
    }
    return true
  }
}
