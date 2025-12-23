import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsArray } from 'class-validator';

/**
 * 更新用户 DTO
 * 用于更新用户信息时的数据验证
 * 所有字段都是可选的
 */
export class UpdateUserDto {
  /**
   * 账户是否激活
   * 可选
   */
  @ApiProperty({
    description: '账户是否激活',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive 必须是布尔值' })
  isActive?: boolean;

  /**
   * 角色 ID 数组
   * 可选，用于更新用户角色
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
