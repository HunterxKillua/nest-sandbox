import {
  Controller,
  Get,
  Query,
  // Headers,
  // Redirect,
  // Param,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  // @Redirect('https://nestjs.com', 301)
  getHello(
    @Query('name') name: string,
    @Body('status', ParseIntPipe) status: 0 | 1,
  ): string {
    try {
      return this.appService.getHello(name, status);
    } catch (e: any) {
      throw new HttpException(
        {
          error_msg: '自定义结构体测试',
          status: true,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error('status只能为0或者1'),
        },
      );
    }
  }
}
