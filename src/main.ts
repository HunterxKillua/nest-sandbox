import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * 应用程序启动函数
 * 负责初始化 NestJS 应用并配置所有全局中间件、管道、过滤器和拦截器
 */
async function bootstrap() {
  // 创建 NestJS 应用实例
  const app = await NestFactory.create(AppModule);

  // 启用 CORS（跨域资源共享）
  // 允许前端应用从不同域名访问 API
  app.enableCors({
    origin: true, // 在生产环境中应该指定具体的域名
    credentials: true,
  });

  // 配置 Swagger API 文档
  // Swagger 提供了一个交互式的 API 文档界面，方便开发和测试
  const config = new DocumentBuilder()
    .setTitle('NestJS RBAC System') // API 文档标题
    .setDescription('基于角色的访问控制系统 API 文档') // API 描述
    .setVersion('1.0') // API 版本
    .addBearerAuth() // 添加 JWT Bearer Token 认证支持
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 在 /api 路径下提供 Swagger UI 界面
  SwaggerModule.setup('api', app, document);

  // 全局验证管道
  // 自动验证所有传入的请求数据，确保数据符合 DTO 定义
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动删除 DTO 中未定义的属性，防止额外数据注入
      transform: true, // 自动将请求数据转换为 DTO 类的实例
      forbidNonWhitelisted: true, // 如果请求包含非白名单属性，抛出错误
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    }),
  );

  // 全局异常过滤器
  // 统一处理所有未捕获的异常，返回标准化的错误响应
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应转换拦截器
  // 将所有成功的响应包装成统一的格式 { code, data, message }
  app.useGlobalInterceptors(new TransformInterceptor());

  // 启动应用，监听 4000 端口
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 应用程序正在运行: ${await app.getUrl()}`);
  console.log(`📚 API 文档地址: ${await app.getUrl()}/api`);
}

// 启动应用程序
bootstrap();
