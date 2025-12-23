import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

/**
 * 认证服务
 * 负责处理用户认证、登录、注册等核心安全功能
 * 使用 JWT (JSON Web Token) 进行身份验证
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户凭证
   * 检查用户名和密码是否匹配
   *
   * @param username - 用户名
   * @param pass - 明文密码
   * @returns 验证成功返回用户信息（不含密码），失败返回 null
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // 根据用户名查找用户
    const user = await this.userService.findOne(username);

    // 验证用户存在且密码匹配
    if (user && (await bcrypt.compare(pass, user.password))) {
      // 从返回结果中移除密码字段，确保安全
      const { password, ...result } = user;
      return result;
    }

    // 验证失败返回 null
    return null;
  }

  /**
   * 用户登录
   * 生成 JWT 访问令牌
   *
   * @param user - 已验证的用户对象
   * @returns 包含 JWT 访问令牌的对象
   */
  async login(user: any) {
    // 构建 JWT 载荷（payload）
    // 包含用户标识信息和角色列表
    const payload = {
      username: user.username, // 用户名
      sub: user.id, // 用户 ID（subject）
      roles: user.roles ? user.roles.map((r) => r.name) : [], // 角色名称数组
    };

    // 签发 JWT 令牌
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 用户注册
   * 创建新用户账户
   *
   * @param user - 用户注册信息
   * @returns 创建的用户对象
   */
  async register(user: any) {
    // 委托给 UserService 创建用户
    // UserService 会自动处理密码加密
    return this.userService.create(user);
  }
}
