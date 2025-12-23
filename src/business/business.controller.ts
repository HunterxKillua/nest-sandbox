import { Controller, Get, UseGuards, Inject, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import Redis from 'ioredis';

/**
 * 业务控制器
 * 演示基于角色的访问控制（RBAC）和 Redis 缓存使用
 *
 * 所有接口都需要 JWT 认证
 * 部分接口需要特定角色权限
 */
@ApiTags('business') // Swagger 标签
@ApiBearerAuth() // 需要 Bearer Token 认证
@Controller('business')
@UseGuards(AuthGuard('jwt'), RolesGuard) // 应用 JWT 认证和角色守卫
export class BusinessController {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * 管理员专用接口
   * 只有拥有 'admin' 角色的用户才能访问
   *
   * @returns 敏感数据
   */
  @Get('admin-only')
  @Roles('admin') // 要求 admin 角色
  @ApiOperation({ summary: '管理员专用接口' })
  @ApiResponse({ status: 200, description: '成功返回敏感数据' })
  @ApiResponse({ status: 403, description: '权限不足' })
  getAdminData() {
    return { sensitiveData: 'Only admins can see this' };
  }

  /**
   * 公共接口（需要认证）
   * 所有已认证用户都可以访问
   *
   * @returns 公共数据
   */
  @Get('public')
  @ApiOperation({ summary: '已认证用户接口' })
  @ApiResponse({ status: 200, description: '成功返回数据' })
  getPublicData() {
    return { data: 'Hello user' };
  }

  /**
   * Redis 缓存测试 - 设置缓存
   * 将键值对存储到 Redis，有效期 60 秒
   * 需要 admin 角色
   *
   * @param key - 缓存键
   * @param value - 缓存值
   * @returns 操作结果
   */
  @Post('cache-test')
  @Roles('admin')
  @ApiOperation({ summary: '测试 Redis 缓存（设置）' })
  @ApiResponse({ status: 200, description: '成功设置缓存' })
  async setCache(@Body('key') key: string, @Body('value') value: string) {
    // 设置缓存，有效期 60 秒
    await this.redis.set(key, value, 'EX', 60);
    return { message: `Set ${key} to ${value} in Redis (expires in 60s)` };
  }

  /**
   * Redis 缓存测试 - 获取所有键
   * 返回 Redis 中的所有键
   *
   * @returns 所有缓存键列表
   */
  @Get('cache-test')
  @ApiOperation({ summary: '测试 Redis 缓存（获取所有键）' })
  @ApiResponse({ status: 200, description: '成功返回所有缓存键' })
  async getCache() {
    // 获取所有键（注意：在生产环境中应避免使用 keys *）
    const keys = await this.redis.keys('*');
    return { keys };
  }
}
