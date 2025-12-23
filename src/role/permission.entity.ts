import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

/**
 * 权限实体
 * 表示系统中的具体权限
 *
 * 关系说明：
 * - 与 Role 实体是多对多关系（一个权限可以分配给多个角色）
 *
 * 权限命名规范：
 * - 使用点号分隔的格式，例如：'user.create'、'user.delete'、'post.edit'
 * - 格式：<资源>.<操作>
 *
 * 示例权限：
 * - 'user.create': 创建用户
 * - 'user.delete': 删除用户
 * - 'post.edit': 编辑文章
 * - 'comment.moderate': 审核评论
 */
@Entity()
export class Permission {
  /**
   * 权限唯一标识符
   * 自动生成的主键
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 权限名称
   * 必须唯一，使用点号分隔格式
   * 例如：'user.create'、'post.edit'、'comment.delete'
   */
  @Column({ unique: true })
  name: string;

  /**
   * 权限描述
   * 可选字段，用于说明权限的具体作用
   * 例如：'允许创建新用户账户'
   */
  @Column({ nullable: true })
  description: string;

  /**
   * 拥有此权限的角色列表
   * 多对多关系的反向引用
   */
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
