import { Injectable } from '@nestjs/common';

/**
 * 应用程序根服务
 * 提供基础的应用级别服务方法
 */
@Injectable()
export class AppService {
  /**
   * 获取欢迎消息
   * @returns 欢迎文本
   */
  getHello(): string {
    return 'Hello World!';
  }
}
