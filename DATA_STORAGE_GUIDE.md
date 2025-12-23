# 数据存储说明文档

## 📊 项目数据存储架构

### 1. 数据库存储（持久化）

#### 使用的数据库：SQLite
- **类型**：文件型关系数据库
- **实现**：SQL.js（SQLite 的 JavaScript 实现）
- **数据文件**：`db.sqlite`（项目根目录）
- **持久化**：✅ 是（数据保存在文件中）

#### 存储的数据
- ✅ 用户信息（User）
- ✅ 角色信息（Role）
- ✅ 权限信息（Permission）
- ✅ 用户-角色关系
- ✅ 角色-权限关系

#### 配置位置
文件：`src/app.module.ts`

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'sqljs',                    // SQLite 的 JS 实现
    location: 'db.sqlite',            // 数据库文件路径
    autoSave: true,                   // 自动保存到文件
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,                // 自动同步数据库结构
    logging: true,                    // 启用 SQL 日志
  }),
})
```

#### 数据持久化验证

**测试步骤：**

1. 启动项目并注册一个用户：
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

2. 停止项目（Ctrl + C）

3. 重新启动项目：
```bash
npm run start:dev
```

4. 尝试登录刚才注册的用户：
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

**预期结果：** ✅ 登录成功，说明数据已持久化

---

### 2. Redis 存储（非持久化）

#### 当前配置：Mock 模式
- **类型**：内存模拟
- **实现**：ioredis-mock
- **持久化**：❌ 否（仅存在内存中）
- **数据丢失**：停止服务后数据丢失

#### 配置位置
文件：`src/redis/redis.module.ts`

```typescript
useFactory: (configService: ConfigService) => {
  // 当前使用 Mock 模式
  console.log('Using Redis Mock for development');
  return new RedisMock();
  
  // 生产环境应切换到真实 Redis
  // return new Redis({ ... });
}
```

#### 存储的数据
- 缓存数据（临时性）
- Session 数据（如果使用）
- 临时令牌（如果使用）

---

## 🔄 数据流程图

```
用户注册/登录
    ↓
Controller 接收请求
    ↓
Service 处理业务逻辑
    ↓
TypeORM Repository
    ↓
SQLite 数据库（db.sqlite 文件）
    ↓
✅ 数据持久化保存
```

---

## 📁 数据库文件位置

### db.sqlite 文件
- **路径**：`项目根目录/db.sqlite`
- **大小**：初始约 64KB，随数据增长
- **格式**：SQLite 数据库文件
- **查看工具**：
  - [DB Browser for SQLite](https://sqlitebrowser.org/)
  - VS Code 插件：SQLite Viewer
  - 在线工具：https://sqliteviewer.app/

### 查看数据库内容

#### 方法 1：使用 DB Browser for SQLite
1. 下载安装 DB Browser for SQLite
2. 打开 `db.sqlite` 文件
3. 查看表结构和数据

#### 方法 2：使用 VS Code 插件
1. 安装 "SQLite Viewer" 插件
2. 在 VS Code 中打开 `db.sqlite` 文件
3. 查看数据

#### 方法 3：使用命令行
```bash
# 安装 sqlite3
npm install -g sqlite3

# 打开数据库
sqlite3 db.sqlite

# 查看所有表
.tables

# 查看用户表
SELECT * FROM user;

# 退出
.quit
```

---

## 🔧 切换到真实 Redis

如果需要使用真实的 Redis（数据持久化），修改 `src/redis/redis.module.ts`：

```typescript
useFactory: (configService: ConfigService) => {
  // 注释掉 Mock 模式
  // return new RedisMock();
  
  // 使用真实 Redis
  return new Redis({
    host: configService.get('REDIS_HOST') || 'localhost',
    port: configService.get('REDIS_PORT') || 6379,
    password: configService.get('REDIS_PASSWORD'),
    // Redis 持久化配置
    retryStrategy: (times) => {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 1000, 3000);
    },
  });
}
```

**前提条件：**
1. 安装 Redis 服务器
2. 启动 Redis 服务
3. 配置环境变量（.env 文件）

---

## 📊 数据持久化对比

| 存储类型 | 技术 | 持久化 | 停止服务后 | 用途 |
|---------|------|--------|-----------|------|
| **数据库** | SQLite (SQL.js) | ✅ 是 | ✅ 数据保留 | 用户、角色、权限等核心数据 |
| **Redis（当前）** | ioredis-mock | ❌ 否 | ❌ 数据丢失 | 缓存、临时数据 |
| **Redis（真实）** | ioredis | ✅ 可配置 | ✅ 可保留 | 缓存、Session、队列 |

---

## 🎯 总结

### 当前项目的数据存储情况：

1. **用户注册的数据**：
   - ✅ 保存在 `db.sqlite` 文件中
   - ✅ **停止服务后数据依然存在**
   - ✅ 可以重启后继续使用

2. **Redis 缓存数据**：
   - ❌ 仅存在内存中（Mock 模式）
   - ❌ **停止服务后数据丢失**
   - ⚠️ 目前项目中 Redis 使用较少，主要用于演示

### 验证方法：

**快速验证数据持久化：**

1. 启动项目
2. 注册一个新用户
3. 停止项目
4. 重新启动项目
5. 尝试登录刚才注册的用户
6. ✅ 如果登录成功，说明数据已持久化

**查看数据库文件：**
- 检查项目根目录是否有 `db.sqlite` 文件
- 文件大小应该大于 0（通常 64KB+）
- 可以使用 SQLite 查看工具打开查看数据

---

## 💡 建议

### 开发环境
- ✅ 当前配置已足够（SQLite + Redis Mock）
- ✅ 数据会持久化保存
- ✅ 无需额外安装 Redis 服务器

### 生产环境
- 🔄 考虑切换到 PostgreSQL/MySQL
- 🔄 使用真实的 Redis 服务器
- 🔄 配置 Redis 持久化（RDB/AOF）
- 🔄 设置 `DB_SYNCHRONIZE=false`

---

## 📚 相关文档

- [TypeORM SQLite 文档](https://typeorm.io/data-source-options#sqlite-data-source-options)
- [SQL.js 文档](https://sql.js.org/)
- [Redis 持久化文档](https://redis.io/docs/management/persistence/)
