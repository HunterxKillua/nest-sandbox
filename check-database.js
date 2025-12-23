/**
 * 检查 SQL.js 数据库内容
 * 使用方法：node check-database.js
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function checkDatabase() {
    try {
        console.log('📊 正在检查数据库...\n');

        // 读取数据库文件
        const dbPath = path.join(__dirname, 'db.sqlite');
        const filebuffer = fs.readFileSync(dbPath);

        console.log(`✅ 数据库文件: ${dbPath}`);
        console.log(`📦 文件大小: ${filebuffer.length} 字节\n`);

        // 初始化 SQL.js
        const SQL = await initSqlJs();
        const db = new SQL.Database(filebuffer);

        // 查看所有表
        console.log('📋 数据库中的表:');
        console.log('='.repeat(80));
        const tables = db.exec(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

        if (tables.length > 0 && tables[0].values.length > 0) {
            tables[0].values.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row[0]}`);
            });
        } else {
            console.log('  （暂无表）');
        }

        console.log('\n' + '='.repeat(80));

        // 查看用户表
        console.log('\n👥 用户表 (user):');
        console.log('-'.repeat(80));
        try {
            const users = db.exec('SELECT id, username, isActive, createdAt FROM user');
            if (users.length > 0 && users[0].values.length > 0) {
                console.log('  列名:', users[0].columns.join(' | '));
                console.log('  ' + '-'.repeat(70));
                users[0].values.forEach(row => {
                    console.log(`  ${row.join(' | ')}`);
                });
                console.log(`\n  总计: ${users[0].values.length} 个用户`);
            } else {
                console.log('  ⚠️  表为空，没有用户数据');
            }
        } catch (error) {
            console.log('  ❌ 表不存在:', error.message);
        }

        // 查看角色表
        console.log('\n🎭 角色表 (role):');
        console.log('-'.repeat(80));
        try {
            const roles = db.exec('SELECT * FROM role');
            if (roles.length > 0 && roles[0].values.length > 0) {
                console.log('  列名:', roles[0].columns.join(' | '));
                console.log('  ' + '-'.repeat(70));
                roles[0].values.forEach(row => {
                    console.log(`  ${row.join(' | ')}`);
                });
                console.log(`\n  总计: ${roles[0].values.length} 个角色`);
            } else {
                console.log('  表为空');
            }
        } catch (error) {
            console.log('  表不存在');
        }

        // 统计信息
        console.log('\n📊 统计信息:');
        console.log('-'.repeat(80));
        try {
            const userCount = db.exec('SELECT COUNT(*) as count FROM user');
            const roleCount = db.exec('SELECT COUNT(*) as count FROM role');
            const permissionCount = db.exec('SELECT COUNT(*) as count FROM permission');

            console.log(`  用户数量: ${userCount[0].values[0][0]}`);
            console.log(`  角色数量: ${roleCount[0].values[0][0]}`);
            console.log(`  权限数量: ${permissionCount[0].values[0][0]}`);
        } catch (error) {
            console.log('  无法获取统计信息');
        }

        console.log('\n' + '='.repeat(80));
        console.log('✅ 检查完成！\n');

        // 关闭数据库
        db.close();

    } catch (error) {
        console.error('❌ 错误:', error.message);
        console.error('\n可能的原因:');
        console.error('  1. 数据库文件不存在');
        console.error('  2. 数据库文件损坏');
        console.error('  3. sql.js 模块未安装');
        console.error('\n解决方法:');
        console.error('  npm install sql.js');
    }
}

checkDatabase();
