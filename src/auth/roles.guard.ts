import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * 角色守卫
 * 基于角色的访问控制守卫
 *
 * 工作流程：
 * 1. 从路由元数据中读取所需角色（通过 @Roles 装饰器设置）
 * 2. 从请求对象中获取当前用户信息（由 JWT 策略填充）
 * 3. 验证用户是否拥有所需角色之一
 * 4. 返回 true 允许访问，返回 false 拒绝访问
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 判断当前用户是否有权限访问路由
   *
   * @param context - 执行上下文，包含请求信息和路由元数据
   * @returns true 允许访问，false 拒绝访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需的角色列表
    // getAllAndOverride 会合并类级别和方法级别的元数据
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // 方法级别的元数据
        context.getClass(), // 类级别的元数据
      ],
    );

    // 如果没有设置角色要求，允许所有已认证用户访问
    if (!requiredRoles) {
      return true;
    }

    // 从请求中获取用户信息
    const { user } = context.switchToHttp().getRequest();

    // 如果用户未登录或没有角色信息，拒绝访问
    if (!user || !user.roles) {
      // 注意：user.roles 由 JwtStrategy 填充，是字符串数组
      return false;
    }

    // 检查用户是否拥有所需角色之一
    // 只要用户拥有任意一个所需角色即可访问
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
