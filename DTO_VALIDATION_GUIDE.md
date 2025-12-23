# DTO 验证使用指南

## 📋 什么是 DTO？

DTO（Data Transfer Object，数据传输对象）是用于在不同层之间传输数据的对象。在 NestJS 中，DTO 主要用于：

1. **定义 API 接口的数据结构**
2. **验证传入的请求数据**
3. **提供 Swagger API 文档**
4. **确保类型安全**

## 🎯 项目中创建的 DTO

### 1. 认证相关 DTO

#### LoginDto - 登录数据验证
文件：`src/auth/dto/login.dto.ts`

```typescript
{
  "username": "admin",      // 必填，3-20 个字符
  "password": "password123" // 必填，6-20 个字符
}
```

**验证规则：**
- ✅ 用户名：字符串，3-20 个字符
- ✅ 密码：字符串，6-20 个字符

#### RegisterDto - 注册数据验证
文件：`src/auth/dto/register.dto.ts`

```typescript
{
  "username": "john_doe",   // 必填，只能包含字母、数字和下划线
  "password": "password123", // 必填，必须包含字母和数字
  "isActive": true          // 可选，默认 true
}
```

**验证规则：**
- ✅ 用户名：3-20 个字符，只能包含字母、数字和下划线
- ✅ 密码：6-20 个字符，必须包含字母和数字
- ✅ isActive：可选，布尔值

### 2. 用户相关 DTO

#### CreateUserDto - 创建用户
文件：`src/user/dto/create-user.dto.ts`

```typescript
{
  "username": "john_doe",
  "password": "password123",
  "isActive": true,
  "roleIds": [1, 2]  // 可选，分配角色
}
```

#### UpdateUserDto - 更新用户
文件：`src/user/dto/update-user.dto.ts`

```typescript
{
  "isActive": false,
  "roleIds": [1]
}
```

### 3. 角色相关 DTO

#### CreateRoleDto - 创建角色
文件：`src/role/dto/create-role.dto.ts`

```typescript
{
  "name": "admin"  // 必填，2-20 个字符
}
```

## 🔍 ValidationPipe 如何工作

### 1. 全局配置（已在 main.ts 中配置）

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // 自动删除非白名单属性
  transform: true,              // 自动转换类型
  forbidNonWhitelisted: true,   // 非白名单属性抛出错误
  transformOptions: {
    enableImplicitConversion: true, // 启用隐式类型转换
  },
}));
```

### 2. 验证流程

```
客户端请求
    ↓
1. 请求到达控制器
    ↓
2. ValidationPipe 拦截 @Body() 参数
    ↓
3. 根据 DTO 类的装饰器验证数据
    ↓
4. 验证通过 → 继续执行控制器方法
   验证失败 → 返回 400 错误
```

## 🧪 测试验证功能

### 测试 1：登录接口 - 成功案例

**请求：**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "code": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Success"
}
```

### 测试 2：登录接口 - 验证失败（用户名太短）

**请求：**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ab",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "code": 400,
  "message": [
    "用户名至少需要 3 个字符"
  ],
  "error": "Bad Request",
  "timestamp": "2023-12-23T10:00:00.000Z",
  "path": "/auth/login"
}
```

### 测试 3：注册接口 - 验证失败（密码格式错误）

**请求：**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "onlyletters"
  }'
```

**预期响应：**
```json
{
  "code": 400,
  "message": [
    "密码必须包含字母和数字"
  ],
  "error": "Bad Request"
}
```

### 测试 4：注册接口 - 验证失败（用户名包含非法字符）

**请求：**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john-doe",
    "password": "password123"
  }'
```

**预期响应：**
```json
{
  "code": 400,
  "message": [
    "用户名只能包含字母、数字和下划线"
  ],
  "error": "Bad Request"
}
```

### 测试 5：创建用户 - 验证失败（额外字段）

**请求：**
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "extraField": "should be removed"
  }'
```

**预期响应：**
```json
{
  "code": 400,
  "message": [
    "property extraField should not exist"
  ],
  "error": "Bad Request"
}
```

## 📝 在 Swagger UI 中测试

### 1. 启动项目
```bash
npm run start:dev
```

### 2. 访问 Swagger UI
打开浏览器访问：`http://localhost:4000/api`

### 3. 测试登录接口
1. 找到 `POST /auth/login`
2. 点击 "Try it out"
3. 输入测试数据：
   ```json
   {
     "username": "ad",  // 故意输入太短的用户名
     "password": "password123"
   }
   ```
4. 点击 "Execute"
5. 查看响应，应该看到验证错误

### 4. 测试注册接口
1. 找到 `POST /auth/register`
2. 点击 "Try it out"
3. 输入测试数据：
   ```json
   {
     "username": "john@doe",  // 故意包含非法字符
     "password": "password123"
   }
   ```
4. 点击 "Execute"
5. 查看响应，应该看到验证错误

## 🎨 class-validator 装饰器说明

### 常用验证装饰器

| 装饰器 | 作用 | 示例 |
|--------|------|------|
| `@IsString()` | 验证是否为字符串 | `@IsString()` |
| `@IsNotEmpty()` | 验证不能为空 | `@IsNotEmpty()` |
| `@MinLength(n)` | 最小长度 | `@MinLength(3)` |
| `@MaxLength(n)` | 最大长度 | `@MaxLength(20)` |
| `@Matches(regex)` | 正则表达式匹配 | `@Matches(/^[a-zA-Z0-9_]+$/)` |
| `@IsOptional()` | 可选字段 | `@IsOptional()` |
| `@IsBoolean()` | 验证是否为布尔值 | `@IsBoolean()` |
| `@IsArray()` | 验证是否为数组 | `@IsArray()` |
| `@IsNumber()` | 验证是否为数字 | `@IsNumber()` |
| `@IsEmail()` | 验证是否为邮箱 | `@IsEmail()` |
| `@Min(n)` | 最小值 | `@Min(0)` |
| `@Max(n)` | 最大值 | `@Max(100)` |

### 自定义错误消息

```typescript
@IsString({ message: '用户名必须是字符串' })
@MinLength(3, { message: '用户名至少需要 3 个字符' })
username: string;
```

## 🔧 创建新的 DTO

### 步骤 1：创建 DTO 文件

```typescript
// src/module-name/dto/your-dto.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class YourDto {
  @ApiProperty({
    description: '字段描述',
    example: '示例值',
  })
  @IsString({ message: '必须是字符串' })
  @IsNotEmpty({ message: '不能为空' })
  fieldName: string;
}
```

### 步骤 2：在控制器中使用

```typescript
@Post()
create(@Body() yourDto: YourDto) {
  return this.service.create(yourDto);
}
```

### 步骤 3：测试验证

在 Swagger UI 或使用 curl 测试接口，验证数据验证是否正常工作。

## 💡 最佳实践

1. **为每个请求创建专用的 DTO**
   - 不要重用实体类作为 DTO
   - 不同的操作使用不同的 DTO（Create、Update、Query）

2. **提供清晰的错误消息**
   - 使用中文错误消息，方便用户理解
   - 错误消息要具体，指出问题所在

3. **使用 @ApiProperty 装饰器**
   - 提供示例值
   - 添加字段描述
   - 标记必填/可选字段

4. **合理使用 @IsOptional()**
   - 可选字段必须使用 @IsOptional()
   - 否则即使不传该字段也会验证失败

5. **使用正则表达式验证格式**
   - 用户名、邮箱、手机号等使用 @Matches()
   - 提供清晰的格式说明

## 📚 参考资源

- [class-validator 文档](https://github.com/typestack/class-validator)
- [NestJS Validation 文档](https://docs.nestjs.com/techniques/validation)
- [Swagger 装饰器文档](https://docs.nestjs.com/openapi/decorators)

## 🎯 下一步

1. 启动项目：`npm run start:dev`
2. 访问 Swagger UI：`http://localhost:4000/api`
3. 测试各个接口的验证功能
4. 观察验证失败时的错误消息
5. 根据需要调整验证规则和错误消息
