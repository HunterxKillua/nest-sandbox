/**
 * SQLite 数据库查看脚本
 * 使用方法：node view-database.js
 */

const Database = require('better-sqlite3');
const path = require('path');

// 打开数据库
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new Database(dbPath, { readonly: true });

console.log('📊 数据库文件:', dbPath);
console.log('='.repeat(80));

// 获取所有表
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`).all();

console.log('\n📋 数据库中的表:');
tables.forEach((table, index) => {
    console.log(`  ${index + 1}. ${table.name}`);
});

console.log('\n' + '='.repeat(80));

// 查看用户表
console.log('\n👥 用户表 (user):');
console.log('-'.repeat(80));
try {
    const users = db.prepare('SELECT id, username, isActive, createdAt FROM user LIMIT 10').all();
    if (users.length === 0) {
        console.log('  （暂无数据）');
    } else {
        console.table(users);
    }
} catch (error) {
    console.log('  表不存在或为空');
}

// 查看角色表
console.log('\n🎭 角色表 (role):');
console.log('-'.repeat(80));
try {
    const roles = db.prepare('SELECT * FROM role LIMIT 10').all();
    if (roles.length === 0) {
        console.log('  （暂无数据）');
    } else {
        console.table(roles);
    }
} catch (error) {
    console.log('  表不存在或为空');
}

// 查看权限表
console.log('\n🔑 权限表 (permission):');
console.log('-'.repeat(80));
try {
    const permissions = db.prepare('SELECT * FROM permission LIMIT 10').all();
    if (permissions.length === 0) {
        console.log('  （暂无数据）');
    } else {
        console.table(permissions);
    }
} catch (error) {
    console.log('  表不存在或为空');
}

// 统计信息
console.log('\n📊 统计信息:');
console.log('-'.repeat(80));
try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM user').get();
    const roleCount = db.prepare('SELECT COUNT(*) as count FROM role').get();
    const permissionCount = db.prepare('SELECT COUNT(*) as count FROM permission').get();

    console.log(`  用户数量: ${userCount.count}`);
    console.log(`  角色数量: ${roleCount.count}`);
    console.log(`  权限数量: ${permissionCount.count}`);
} catch (error) {
    console.log('  无法获取统计信息');
}

console.log('\n' + '='.repeat(80));
console.log('✅ 查询完成！\n');

// 关闭数据库
db.close();
