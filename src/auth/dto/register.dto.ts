import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';

/**
 * 用户注册 DTO
 * 用于验证注册请求的数据
 */
export class RegisterDto {
  /**
   * 用户名
   * 必填，长度 3-20 个字符，只能包含字母、数字和下划线
   */
  @ApiProperty({
    description: '用户名（只能包含字母、数字和下划线）',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少需要 3 个字符' })
  @MaxLength(20, { message: '用户名最多 20 个字符' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '用户名只能包含字母、数字和下划线',
  })
  username: string;

  /**
   * 密码
   * 必填，长度 6-20 个字符，必须包含字母和数字
   */
  @ApiProperty({
    description: '密码（必须包含字母和数字）',
    example: 'password123',
    minLength: 6,
    maxLength: 20,
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少需要 6 个字符' })
  @MaxLength(20, { message: '密码最多 20 个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, {
    message: '密码必须包含字母和数字',
  })
  password: string;

  /**
   * 账户是否激活
   * 可选，默认为 true
   */
  @ApiProperty({
    description: '账户是否激活',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive 必须是布尔值' })
  isActive?: boolean;
}
