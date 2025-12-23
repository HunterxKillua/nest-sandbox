import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';

/**
 * 用户实体
 * 表示系统中的用户账户
 *
 * 关系说明：
 * - 与 Role 实体是多对多关系（一个用户可以有多个角色，一个角色可以分配给多个用户）
 */
@Entity()
export class User {
  /**
   * 用户唯一标识符
   * 自动生成的主键
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户名
   * 必须唯一，用于登录
   */
  @Column({ unique: true })
  username: string;

  /**
   * 用户密码
   * 使用 bcrypt 加密存储
   * select: false 表示默认查询时不返回此字段，需要显式指定才会返回
   */
  @Column({ select: false })
  password: string;

  /**
   * 用户账户是否激活
   * true: 激活（可以登录）
   * false: 禁用（无法登录）
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * 用户拥有的角色列表
   * 多对多关系，通过中间表关联
   * cascade: true 表示保存用户时会级联保存关联的角色
   */
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable() // 指定这一侧维护关系（创建中间表）
  roles: Role[];

  /**
   * 创建时间
   * 自动记录用户创建的时间戳
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 更新时间
   * 自动记录用户最后更新的时间戳
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
