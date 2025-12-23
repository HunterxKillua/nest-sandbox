import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 响应数据接口
 * 定义统一的响应格式
 */
export interface Response<T> {
  data: T;
}

/**
 * 响应转换拦截器
 * 将所有成功的响应包装成统一的格式
 *
 * 功能：
 * - 拦截所有成功的响应
 * - 将响应数据包装成 { code, data, message } 格式
 * - 提供统一的 API 响应结构
 *
 * 响应格式：
 * {
 *   code: 200,           // HTTP 状态码
 *   data: <原始响应数据>,  // 实际的响应数据
 *   message: 'Success'   // 成功消息
 * }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * 拦截方法
   *
   * @param context - 执行上下文
   * @param next - 调用处理器
   * @returns 包装后的响应数据流
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 使用 RxJS 的 map 操作符转换响应数据
    // 将原始数据包装成统一格式
    return next
      .handle()
      .pipe(map((data) => ({ code: 200, data, message: 'Success' })));
  }
}
