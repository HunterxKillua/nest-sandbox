import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * 用户控制器
 * 处理用户管理相关的 HTTP 请求
 */
@ApiTags('users') // Swagger 标签
@ApiBearerAuth() // 需要 Bearer Token 认证
@UseGuards(AuthGuard('jwt')) // 应用 JWT 认证守卫
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建新用户
   *
   * @param createUserDto - 用户信息
   * @returns 创建的用户对象
   */
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  @ApiResponse({ status: 400, description: '请求数据无效' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * 根据 ID 获取用户信息
   *
   * @param id - 用户 ID
   * @returns 用户对象
   */
  @Get(':id')
  @ApiOperation({ summary: '根据 ID 获取用户' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
