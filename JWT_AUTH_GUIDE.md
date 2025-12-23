# JWT 认证使用指南

## 🔐 如何使用 Bearer Token 认证

### 1. 获取 JWT Token

首先需要登录获取 Token：

#### 使用 Swagger UI
1. 访问 `http://localhost:4000/api`
2. 找到 `POST /auth/login` 接口
3. 点击 "Try it out"
4. 输入请求体：
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
5. 点击 "Execute"
6. 从响应中复制 `access_token` 的值

#### 使用 curl
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

响应示例：
```json
{
  "code": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Success"
}
```

### 2. 使用 Token 访问受保护的接口

#### 方法 A：使用 Swagger UI（推荐）

1. 在 Swagger UI 页面顶部，点击 **"Authorize"** 按钮（或带锁的接口旁边的锁图标）
2. 在弹出的对话框中，输入：
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   **注意**：需要包含 `Bearer ` 前缀（Bearer 后面有一个空格）
3. 点击 "Authorize"
4. 现在所有带 🔒 图标的接口都会自动携带这个 Token

#### 方法 B：使用 curl

```bash
curl -X GET http://localhost:4000/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 方法 C：使用 Postman

1. 选择请求方法（GET、POST 等）
2. 输入 URL：`http://localhost:4000/users/1`
3. 切换到 **"Authorization"** 标签
4. Type 选择：**"Bearer Token"**
5. 在 Token 输入框中粘贴你的 JWT token（**不需要** `Bearer ` 前缀，Postman 会自动添加）

#### 方法 D：使用 JavaScript/Axios

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// 使用 axios
axios.get('http://localhost:4000/users/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 使用 fetch
fetch('http://localhost:4000/users/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📋 Headers 格式详解

### 正确的 Header 格式

```
Authorization: Bearer <token>
```

- **Header 名称**：`Authorization`（注意大小写）
- **值的格式**：`Bearer <空格> <token>`
- **Bearer** 是认证方案的名称
- **token** 是你从登录接口获取的 JWT 字符串

### 示例

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTYzOTU4NzYwMCwiZXhwIjoxNjM5NTkxMjAwfQ.abc123def456
```

## 🎯 项目中的认证流程

### 1. 用户登录
```typescript
// POST /auth/login
{
  "username": "admin",
  "password": "password123"
}

// 响应
{
  "code": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Success"
}
```

### 2. 访问受保护的接口
```typescript
// GET /users/1
// Headers:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 响应
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "isActive": true,
    "roles": [...]
  },
  "message": "Success"
}
```

### 3. 访问需要特定角色的接口
```typescript
// GET /business/admin-only
// Headers:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// 需要 'admin' 角色

// 成功响应（如果有 admin 角色）
{
  "code": 200,
  "data": {
    "sensitiveData": "Only admins can see this"
  },
  "message": "Success"
}

// 失败响应（如果没有 admin 角色）
{
  "code": 403,
  "message": "Forbidden resource",
  "timestamp": "2023-12-23T10:00:00.000Z",
  "path": "/business/admin-only"
}
```

## 🔍 常见问题

### Q1: Token 过期了怎么办？
A: 重新登录获取新的 Token。Token 的有效期在环境变量 `JWT_EXPIRES_IN` 中配置（默认 3600 秒 = 1 小时）

### Q2: 忘记添加 "Bearer " 前缀会怎样？
A: 会返回 401 Unauthorized 错误，因为 JWT 策略无法正确解析 Token

### Q3: 如何查看 Token 的内容？
A: 访问 https://jwt.io/ 并粘贴你的 Token，可以看到解码后的内容（但不要泄露真实的 Token！）

### Q4: @ApiBearerAuth() 和 @UseGuards() 的区别？
A: 
- `@ApiBearerAuth()`：仅用于 Swagger 文档，告诉开发者这个接口需要认证
- `@UseGuards(AuthGuard('jwt'))`：实际执行认证逻辑，验证 Token 是否有效

## 💡 快速测试

### 1. 创建测试用户（如果还没有）
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### 2. 登录获取 Token
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### 3. 使用 Token 访问接口
```bash
# 将 <TOKEN> 替换为实际的 token
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

## 📚 相关代码位置

- **JWT 策略配置**：`src/auth/jwt.strategy.ts`
- **认证守卫**：`@UseGuards(AuthGuard('jwt'))`
- **角色守卫**：`src/auth/roles.guard.ts`
- **登录接口**：`src/auth/auth.controller.ts` 的 `login` 方法
