# SQLite 查看和管理指南

## 📊 方法 1：VS Code 插件（推荐）

### SQLite Viewer
**最简单的方式，直接在 VS Code 中查看**

#### 安装步骤：
1. 打开 VS Code
2. 按 `Ctrl + Shift + X` 打开扩展
3. 搜索 "SQLite Viewer"
4. 安装 "SQLite Viewer" by Florian Klampfer

#### 使用方法：
1. 在 VS Code 文件浏览器中找到 `db.sqlite`
2. 右键点击文件
3. 选择 "Open with SQLite Viewer"
4. 查看所有表和数据

---

## 💻 方法 2：命令行工具（类似 MySQL）

### 安装 SQLite 命令行工具

#### Windows 系统：

**方式 A：使用 Chocolatey（推荐）**
```powershell
# 如果已安装 Chocolatey
choco install sqlite

# 验证安装
sqlite3 --version
```

**方式 B：手动下载**
1. 访问：https://www.sqlite.org/download.html
2. 下载 "sqlite-tools-win32-x86-*.zip"
3. 解压到某个目录（如 `C:\sqlite`）
4. 将该目录添加到系统 PATH

**方式 C：使用 npm（最简单）**
```bash
# 全局安装 sqlite3
npm install -g sqlite3

# 或者在项目中使用
npx sqlite3 db.sqlite
```

### 使用 SQLite 命令行

#### 1. 打开数据库
```bash
# 进入项目目录
cd c:\Users\grain\Desktop\nest-project

# 打开数据库
sqlite3 db.sqlite
```

#### 2. 常用命令

```sql
-- 查看所有表
.tables

-- 查看表结构
.schema user
.schema role
.schema permission

-- 查看所有用户
SELECT * FROM user;

-- 查看用户详细信息（格式化输出）
.mode column
.headers on
SELECT id, username, isActive, createdAt FROM user;

-- 查看角色
SELECT * FROM role;

-- 查看权限
SELECT * FROM permission;

-- 查看用户和角色的关系
SELECT 
  u.username, 
  r.name as role 
FROM user u
LEFT JOIN user_roles_role urr ON u.id = urr.userId
LEFT JOIN role r ON urr.roleId = r.id;

-- 统计用户数量
SELECT COUNT(*) as total_users FROM user;

-- 查找特定用户
SELECT * FROM user WHERE username = 'admin';

-- 退出
.quit
-- 或者
.exit
```

#### 3. 输出格式设置

```sql
-- 列模式（对齐显示）
.mode column

-- 显示表头
.headers on

-- 美化输出
.mode box

-- CSV 格式
.mode csv

-- JSON 格式
.mode json

-- 设置列宽
.width 5 20 10 30
```

#### 4. 导出数据

```sql
-- 导出为 SQL
.output backup.sql
.dump

-- 导出为 CSV
.mode csv
.output users.csv
SELECT * FROM user;
.output stdout

-- 导出特定表
.output user_table.sql
.dump user
.output stdout
```

---

## 🖥️ 方法 3：图形化工具

### 1. DB Browser for SQLite（免费，功能强大）

**下载地址**：https://sqlitebrowser.org/

**特点**：
- ✅ 完全免费
- ✅ 跨平台（Windows/Mac/Linux）
- ✅ 可视化界面
- ✅ 支持编辑数据
- ✅ 支持执行 SQL 查询

**使用方法**：
1. 下载并安装
2. 打开软件
3. File → Open Database
4. 选择 `db.sqlite` 文件
5. 在 "Browse Data" 标签页查看数据

### 2. SQLiteStudio（免费）

**下载地址**：https://sqlitestudio.pl/

**特点**：
- ✅ 免费开源
- ✅ 功能丰富
- ✅ 支持多数据库
- ✅ 支持插件

### 3. DBeaver（免费，支持多种数据库）

**下载地址**：https://dbeaver.io/

**特点**：
- ✅ 支持 SQLite、MySQL、PostgreSQL 等
- ✅ 专业级工具
- ✅ 社区版免费

---

## 🌐 方法 4：在线工具

### SQLite Viewer Online

**网址**：https://sqliteviewer.app/

**使用方法**：
1. 访问网站
2. 点击 "Choose File"
3. 选择 `db.sqlite` 文件
4. 在线查看数据

**注意**：数据不会上传到服务器，完全在浏览器中处理

---

## 📝 实用 SQL 查询示例

### 查看项目数据

```sql
-- 1. 查看所有用户
SELECT 
  id,
  username,
  isActive,
  datetime(createdAt/1000, 'unixepoch') as created_time
FROM user;

-- 2. 查看用户及其角色
SELECT 
  u.username,
  GROUP_CONCAT(r.name) as roles
FROM user u
LEFT JOIN user_roles_role urr ON u.id = urr.userId
LEFT JOIN role r ON urr.roleId = r.id
GROUP BY u.id, u.username;

-- 3. 查看角色及其权限
SELECT 
  r.name as role_name,
  GROUP_CONCAT(p.name) as permissions
FROM role r
LEFT JOIN role_permissions_permission rpp ON r.id = rpp.roleId
LEFT JOIN permission p ON rpp.permissionId = p.id
GROUP BY r.id, r.name;

-- 4. 查看最近注册的用户
SELECT 
  username,
  datetime(createdAt/1000, 'unixepoch') as registered_at
FROM user
ORDER BY createdAt DESC
LIMIT 5;

-- 5. 统计信息
SELECT 
  (SELECT COUNT(*) FROM user) as total_users,
  (SELECT COUNT(*) FROM role) as total_roles,
  (SELECT COUNT(*) FROM permission) as total_permissions;
```

---

## 🎯 快速开始（推荐流程）

### 最简单的方式：

1. **安装 VS Code 插件**
   ```
   扩展市场搜索 "SQLite Viewer" → 安装
   ```

2. **打开数据库**
   ```
   右键 db.sqlite → Open with SQLite Viewer
   ```

3. **查看数据**
   - 点击表名查看数据
   - 可以直接编辑
   - 可以执行 SQL 查询

### 如果想用命令行：

```bash
# 1. 使用 npx（无需安装）
npx sqlite3 db.sqlite

# 2. 查看表
.tables

# 3. 查看用户
SELECT * FROM user;

# 4. 退出
.quit
```

---

## 💡 常见问题

### Q1: 找不到 db.sqlite 文件？
**A**: 启动项目一次，数据库文件会自动创建

### Q2: 命令行中文乱码？
**A**: 在 PowerShell 中执行：
```powershell
chcp 65001
```

### Q3: 如何备份数据库？
**A**: 直接复制 `db.sqlite` 文件即可

### Q4: 如何重置数据库？
**A**: 删除 `db.sqlite` 文件，重启项目会自动创建新的

---

## 📚 参考资源

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [SQLite 命令行工具](https://www.sqlite.org/cli.html)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
