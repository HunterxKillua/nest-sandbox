import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

/**
 * 用户服务
 * 负责处理用户相关的业务逻辑
 * 包括用户创建、查询等核心功能
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 创建新用户
   * 自动对密码进行加密处理
   *
   * @param userData - 用户数据（包含 username、password 等）
   * @returns 创建的用户对象
   */
  async create(userData: Partial<User>): Promise<User> {
    // 生成盐值用于密码加密
    const salt = await bcrypt.genSalt();

    // 使用 bcrypt 对密码进行哈希加密
    // 如果没有提供密码，使用默认密码
    const hashedPassword = await bcrypt.hash(
      userData.password || 'defaultPassword',
      salt,
    );

    // 创建用户实体实例
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword, // 使用加密后的密码
    });

    // 保存到数据库并返回
    return this.userRepository.save(newUser);
  }

  /**
   * 根据用户名查找用户
   * 用于登录验证，包含密码字段和关联的角色权限信息
   *
   * @param username - 用户名
   * @returns 用户对象（包含密码和角色信息）或 null
   */
  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'], // 加载角色和权限关系
      select: ['id', 'username', 'password', 'isActive', 'roles'], // 显式包含密码字段
    });
  }

  /**
   * 根据 ID 查找用户
   * 包含用户的角色和权限信息
   *
   * @param id - 用户 ID
   * @returns 用户对象
   * @throws NotFoundException 当用户不存在时
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'], // 加载角色和权限关系
    });

    // 如果用户不存在，抛出 404 异常
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    return user;
  }
}
