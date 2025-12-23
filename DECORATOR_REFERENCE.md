# NestJS 常用装饰器参考指南

## 🎯 控制器装饰器

### @Controller(prefix?: string)
定义控制器类
```typescript
@Controller('users')  // 路由前缀为 /users
export class UserController {}
```

### HTTP 方法装饰器

#### @Get(path?: string)
处理 GET 请求
```typescript
@Get()           // GET /users
@Get(':id')      // GET /users/:id
@Get('profile')  // GET /users/profile
```

#### @Post(path?: string)
处理 POST 请求
```typescript
@Post()          // POST /users
@Post('login')   // POST /users/login
```

#### @Put(path?: string) / @Patch(path?: string) / @Delete(path?: string)
处理 PUT/PATCH/DELETE 请求
```typescript
@Put(':id')      // PUT /users/:id
@Patch(':id')    // PATCH /users/:id
@Delete(':id')   // DELETE /users/:id
```

## 📦 参数装饰器

### @Body(key?: string)
获取请求体数据
```typescript
// 获取整个请求体
@Post()
create(@Body() createDto: CreateUserDto) {}

// 获取请求体中的特定字段
@Post()
create(@Body('username') username: string) {}
```

### @Param(key?: string)
获取路由参数
```typescript
// 获取所有路由参数
@Get(':id')
findOne(@Param() params: any) {}

// 获取特定路由参数
@Get(':id')
findOne(@Param('id') id: string) {}

// 使用管道转换类型
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
```

### @Query(key?: string)
获取查询参数
```typescript
// 获取所有查询参数
@Get()
findAll(@Query() query: any) {}

// 获取特定查询参数
@Get()
findAll(@Query('page') page: number) {}
```

### @Headers(name?: string)
获取请求头
```typescript
@Get()
findAll(@Headers('authorization') auth: string) {}
```

### @Request() / @Req()
获取完整的请求对象
```typescript
@Get()
findAll(@Request() req: Request) {}
```

### @Response() / @Res()
获取响应对象（不推荐，会禁用标准响应处理）
```typescript
@Get()
findAll(@Response() res: Response) {
  res.status(200).json({ data: [] });
}
```

## 🔒 守卫装饰器

### @UseGuards(...guards)
应用守卫
```typescript
// 单个守卫
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile() {}

// 多个守卫
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Get('admin')
getAdminData() {}

// 应用到整个控制器
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {}
```

## 🔧 管道装饰器

### @UsePipes(...pipes)
应用管道
```typescript
@Post()
@UsePipes(ValidationPipe)
create(@Body() dto: CreateUserDto) {}
```

### 内置管道
```typescript
ParseIntPipe      // 转换为整数
ParseFloatPipe    // 转换为浮点数
ParseBoolPipe     // 转换为布尔值
ParseArrayPipe    // 转换为数组
ParseUUIDPipe     // 验证 UUID
ValidationPipe    // 验证 DTO
```

## 📝 Swagger 装饰器

### @ApiTags(tag: string)
API 分组标签
```typescript
@ApiTags('users')
@Controller('users')
export class UserController {}
```

### @ApiOperation(options)
API 操作描述
```typescript
@ApiOperation({ 
  summary: '创建用户',
  description: '创建一个新的用户账户'
})
@Post()
create() {}
```

### @ApiResponse(options)
API 响应描述
```typescript
@ApiResponse({ 
  status: 200, 
  description: '成功返回用户列表' 
})
@ApiResponse({ 
  status: 404, 
  description: '用户不存在' 
})
@Get()
findAll() {}
```

### @ApiBearerAuth()
需要 Bearer Token 认证
```typescript
@ApiBearerAuth()
@Get('profile')
getProfile() {}
```

### @ApiProperty(options)
DTO 属性文档（用于类属性）
```typescript
export class CreateUserDto {
  @ApiProperty({ 
    description: '用户名',
    example: 'john_doe',
    required: true
  })
  username: string;

  @ApiProperty({ 
    description: '密码',
    minLength: 6,
    example: 'password123'
  })
  password: string;
}
```

## 🎨 自定义装饰器

### @Roles(...roles: string[])
角色权限装饰器（项目中的自定义装饰器）
```typescript
@Roles('admin')
@Get('admin-only')
getAdminData() {}

@Roles('admin', 'moderator')
@Get('moderators')
getModeratorData() {}
```

## 🔍 依赖注入装饰器

### @Injectable()
标记类可被注入
```typescript
@Injectable()
export class UserService {}
```

### @Inject(token)
注入特定的提供者
```typescript
constructor(
  @Inject('REDIS_CLIENT') private redis: Redis
) {}
```

### @InjectRepository(entity)
注入 TypeORM 仓库
```typescript
constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>
) {}
```

## 💡 实用技巧

### 1. 组合使用装饰器
```typescript
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  
  @Get(':id')
  @ApiOperation({ summary: '获取用户' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 404, description: '未找到' })
  findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User> {
    return this.userService.findById(id);
  }
}
```

### 2. 查看装饰器类型定义
在 VS Code 中：
- **Ctrl + 点击**装饰器名称，跳转到定义
- **鼠标悬停**查看快速文档
- **Ctrl + Space** 在括号内触发参数提示

### 3. 使用 TypeScript 类型检查
```typescript
// TypeScript 会自动检查参数类型
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number  // ✅ 正确
  // @Param('id', ParseIntPipe) id: string  // ❌ 类型错误
) {}
```

## 📚 更多资源

- **NestJS 官方文档**：https://docs.nestjs.com/
- **Swagger 装饰器文档**：https://docs.nestjs.com/openapi/decorators
- **TypeORM 装饰器**：https://typeorm.io/decorator-reference
- **Class Validator 装饰器**：https://github.com/typestack/class-validator

## 🎯 快速查找方法

1. **在项目中搜索**：Ctrl + Shift + F 搜索装饰器使用示例
2. **查看定义**：Ctrl + 点击装饰器跳转到源码
3. **查看文档**：访问 NestJS 官方文档
4. **使用 Swagger UI**：运行项目后访问 `/api` 查看 API 文档
