import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../user/user.entity';

/**
 * 角色实体
 * 表示系统中的用户角色
 *
 * 关系说明：
 * - 与 User 实体是多对多关系（一个角色可以分配给多个用户）
 * - 与 Permission 实体是多对多关系（一个角色可以拥有多个权限）
 *
 * 示例角色：'admin'（管理员）、'user'（普通用户）、'moderator'（版主）
 */
@Entity()
export class Role {
  /**
   * 角色唯一标识符
   * 自动生成的主键
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 角色名称
   * 必须唯一，例如：'admin'、'user'、'moderator'
   * 用于权限验证和角色分配
   */
  @Column({ unique: true })
  name: string;

  /**
   * 角色拥有的权限列表
   * 多对多关系，通过中间表关联
   * cascade: true 表示保存角色时会级联保存关联的权限
   */
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable() // 指定这一侧维护关系（创建中间表）
  permissions: Permission[];

  /**
   * 拥有此角色的用户列表
   * 多对多关系的反向引用
   */
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
