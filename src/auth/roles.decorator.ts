import { SetMetadata } from '@nestjs/common';

/**
 * 角色元数据键
 * 用于在路由处理器上存储所需角色信息
 */
export const ROLES_KEY = 'roles';

/**
 * 角色装饰器
 * 用于标记路由需要的角色权限
 *
 * 使用方法：
 * ```typescript
 * @Roles('admin', 'moderator')
 * @Get('admin-only')
 * getAdminData() {
 *   return { data: 'sensitive' };
 * }
 * ```
 *
 * 注意：需要配合 RolesGuard 使用才能生效
 *
 * @param roles - 允许访问的角色名称列表
 * @returns 元数据装饰器
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
