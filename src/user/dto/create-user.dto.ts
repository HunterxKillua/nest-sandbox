import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

/**
 * 创建用户 DTO
 * 用于管理员创建用户时的数据验证
 */
export class CreateUserDto {
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

  /**
   * 角色 ID 数组
   * 可选，用于分配角色
   */
  @ApiProperty({
    description: '角色 ID 数组',
    example: [1, 2],
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'roleIds 必须是数组' })
  roleIds?: number[];
}
