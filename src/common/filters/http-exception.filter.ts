import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 全局异常过滤器
 * 捕获并处理应用中的所有异常，返回统一格式的错误响应
 *
 * 功能：
 * 1. 捕获所有类型的异常（HTTP 异常和其他异常）
 * 2. 将异常转换为统一的 JSON 响应格式
 * 3. 记录服务器内部错误日志
 * 4. 提供友好的错误信息给客户端
 */
@Catch() // 捕获所有异常
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 异常处理方法
   *
   * @param exception - 捕获到的异常对象
   * @param host - 执行上下文，包含请求和响应对象
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取 HTTP 上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定 HTTP 状态码
    // 如果是 HttpException，使用其状态码；否则使用 500（内部服务器错误）
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 对于服务器内部错误，记录详细的错误信息到控制台
    // 便于开发和调试
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Internal Server Error:', exception);
    }

    // 提取错误消息
    // 如果是 HttpException，获取其响应内容；否则使用默认消息
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 返回统一格式的错误响应
    response.status(status).json({
      code: status, // HTTP 状态码
      timestamp: new Date().toISOString(), // 错误发生时间
      path: request.url, // 请求路径
      message, // 错误消息
    });
  }
}
