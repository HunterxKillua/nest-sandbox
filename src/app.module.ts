import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { RedisModule } from './redis/redis.module';
import { BusinessModule } from './business/business.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

/**
 * 应用程序根模块
 * 负责整合所有功能模块，配置数据库连接和全局中间件
 *
 * 模块结构：
 * - ConfigModule: 环境变量配置管理
 * - TypeOrmModule: 数据库 ORM 配置
 * - UserModule: 用户管理模块
 * - AuthModule: 认证授权模块
 * - RoleModule: 角色权限管理模块
 * - RedisModule: Redis 缓存模块
 * - BusinessModule: 业务逻辑模块
 */
@Module({
  imports: [
    // 配置模块 - 加载环境变量
    // isGlobal: true 使配置在整个应用中全局可用
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'], // 按优先级加载环境变量文件
    }),

    // TypeORM 数据库配置
    // 使用 SQLite 作为数据库，适合开发和小型应用
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqljs', // 使用 SQL.js（SQLite 的 JavaScript 实现）
        location: configService.get<string>('DB_DATABASE') || 'db.sqlite', // 数据库文件位置
        autoSave: true, // 自动保存数据到文件
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动加载所有实体
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || true, // 自动同步数据库结构（生产环境应设为 false）
        logging: configService.get<boolean>('DB_LOGGING') || true, // 启用 SQL 查询日志
      }),
    }),

    // 功能模块
    UserModule, // 用户管理
    AuthModule, // 认证和授权
    RoleModule, // 角色和权限管理
    RedisModule, // Redis 缓存服务
    BusinessModule, // 业务逻辑
  ],
  controllers: [AppController], // 根控制器
  providers: [AppService], // 根服务
})
export class AppModule {
  /**
   * 配置全局中间件
   * 为所有路由应用日志记录中间件
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 应用日志中间件
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 匹配所有路由
  }
}
