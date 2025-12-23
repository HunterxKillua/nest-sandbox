import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 认证策略
 * 使用 Passport JWT 策略验证请求中的 JWT 令牌
 *
 * 工作流程：
 * 1. 从请求头中提取 Bearer Token
 * 2. 验证令牌签名和有效期
 * 3. 解析令牌载荷并调用 validate 方法
 * 4. validate 方法返回的对象会被附加到 request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 从 Authorization 头中提取 Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 不忽略过期令牌（过期令牌会被拒绝）
      ignoreExpiration: false,

      // JWT 签名密钥（应该与签发时使用的密钥一致）
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'super-secret-key',
    });
  }

  /**
   * 验证 JWT 载荷
   * 此方法在令牌验证成功后自动调用
   *
   * @param payload - JWT 解码后的载荷数据
   * @returns 用户信息对象，会被附加到 request.user
   */
  async validate(payload: any) {
    // 从 JWT 载荷中提取用户信息
    // 这些信息在登录时被编码到令牌中
    return {
      userId: payload.sub, // 用户 ID
      username: payload.username, // 用户名
      roles: payload.roles, // 用户角色列表
    };
  }
}
