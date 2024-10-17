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
  ParseEnumPipe,
} from '@nestjs/common';
import { AppService } from './app.service';

export enum StatusEnum {
  SUCCESS = 0,
  ERROR = 1,
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  // @Redirect('https://nestjs.com', 301)
  getHello(
    @Query('name') name: string,
    @Body('status', new ParseEnumPipe(StatusEnum)) status: 0 | 1,
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
