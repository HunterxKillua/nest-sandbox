import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

/**
 * 创建角色 DTO
 * 用于创建新角色时的数据验证
 */
export class CreateRoleDto {
  /**
   * 角色名称
   * 必填，长度 2-20 个字符
   * 例如：'admin', 'user', 'moderator'
   */
  @ApiProperty({
    description: '角色名称',
    example: 'admin',
    minLength: 2,
    maxLength: 20,
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MinLength(2, { message: '角色名称至少需要 2 个字符' })
  @MaxLength(20, { message: '角色名称最多 20 个字符' })
  name: string;
}
