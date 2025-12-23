import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * 认证控制器
 * 处理用户认证相关的 HTTP 请求
 * 包括登录、注册和获取用户资料等功能
 */
@ApiTags('auth') // Swagger 标签分组
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 用户登录接口
   * 验证用户凭证并返回 JWT 访问令牌
   *
   * @param loginDto - 登录信息（用户名和密码）
   * @returns JWT 访问令牌
   * @throws UnauthorizedException 当凭证无效时
   */
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功，返回 JWT 令牌' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  @ApiResponse({ status: 400, description: '请求数据验证失败' })
  async login(@Body() loginDto: LoginDto) {
    // 验证用户凭证
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // 如果验证失败，抛出未授权异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成并返回 JWT 令牌
    return this.authService.login(user);
  }

  /**
   * 用户注册接口
   * 创建新用户账户
   *
   * @param registerDto - 用户注册信息
   * @returns 创建的用户对象
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册信息无效或用户已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 获取当前用户资料
   * 需要 JWT 认证
   *
   * @param req - 包含已认证用户信息的请求对象
   * @returns 当前用户信息
   */
  @UseGuards(AuthGuard('jwt')) // 应用 JWT 认证守卫
  @ApiBearerAuth() // Swagger 文档中显示需要 Bearer Token
  @Get('profile')
  @ApiOperation({ summary: '获取当前用户资料' })
  @ApiResponse({ status: 200, description: '成功返回用户资料' })
  @ApiResponse({ status: 401, description: '未授权，需要登录' })
  getProfile(@Request() req) {
    // req.user 由 JWT 策略自动填充
    return req.user;
  }
}
