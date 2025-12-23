import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisMock = require('ioredis-mock');

/**
 * Redis 模块
 * 提供 Redis 客户端实例供整个应用使用
 *
 * @Global 装饰器使此模块成为全局模块
 * 这意味着 REDIS_CLIENT 可以在任何模块中注入使用，无需重复导入
 *
 * 配置说明：
 * - 当前使用 ioredis-mock 模拟 Redis，避免本地开发时的连接问题
 * - 生产环境应切换到真实的 Redis 连接
 *
 * 环境变量：
 * - REDIS_HOST: Redis 服务器地址（默认：localhost）
 * - REDIS_PORT: Redis 端口（默认：6379）
 * - REDIS_PASSWORD: Redis 密码（可选）
 */
@Global() // 全局模块，无需在其他模块中导入即可使用
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT', // 注入令牌
      useFactory: (configService: ConfigService) => {
        // 当前使用 Mock 模式，避免连接真实 Redis 的问题
        // 适合开发和测试环境
        console.log('Using Redis Mock for development');
        return new RedisMock();

        /*
        // 生产环境配置：连接真实的 Redis
        // 取消注释以下代码并注释掉上面的 Mock 代码
        return new Redis({
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
          password: configService.get('REDIS_PASSWORD'),
          retryStrategy: (times) => {
            // 重试策略：最多重试 3 次，每次延迟递增
            if (times > 3) {
              console.error('Redis connection failed after 3 retries');
              return null; // 停止重试
            }
            return Math.min(times * 1000, 3000); // 延迟时间（毫秒）
          },
        });
        */
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'], // 导出供其他模块使用
})
export class RedisModule {}
