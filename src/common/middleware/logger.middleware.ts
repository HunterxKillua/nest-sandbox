import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 日志中间件
 * 记录所有传入的 HTTP 请求信息
 *
 * 功能：
 * - 记录请求方法（GET、POST 等）
 * - 记录请求路径
 * - 记录请求时间戳
 * - 便于调试和监控应用
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * 中间件处理方法
   *
   * @param req - Express 请求对象
   * @param res - Express 响应对象
   * @param next - 下一个中间件函数
   */
  use(req: Request, res: Response, next: NextFunction) {
    // 记录请求信息
    // 格式：[Request] <方法> <路径> - <时间戳>
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);

    // 可选：记录请求来源 IP
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`  └─ IP: ${ip}`);

    // 调用下一个中间件或路由处理器
    next();
  }
}
