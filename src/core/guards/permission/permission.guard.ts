import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from '../../../modules/auth/entity/auth.entity.js';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../../decorators/permission.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AuthEntity) private AuthRepo: Repository<AuthEntity>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // console.log(request.user);
    // console.log(request.user.userId);
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.AuthRepo.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user?.role) {
      throw new ForbiddenException('Role not assigned');
    }

    const permissions = user.role.permissions ?? [];

    const hasPermission = requiredPermissions.every((per) =>
      permissions.includes(per),
    );
    // console.log('Required:', requiredPermissions);
    // console.log('Database:', user.role.permissions);
    // console.log('Role:', user.role.role_name);

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
