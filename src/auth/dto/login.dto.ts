import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * 用户登录 DTO
 * 用于验证登录请求的数据
 */
export class LoginDto {
  /**
   * 用户名
   * 必填，长度 3-20 个字符
   */
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少需要 3 个字符' })
  @MaxLength(20, { message: '用户名最多 20 个字符' })
  username: string;

  /**
   * 密码
   * 必填，长度 6-20 个字符
   */
  @ApiProperty({
    description: '密码',
    example: 'password123',
    minLength: 6,
    maxLength: 20,
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少需要 6 个字符' })
  @MaxLength(20, { message: '密码最多 20 个字符' })
  password: string;
}
