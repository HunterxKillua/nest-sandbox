// 简单的数据库文件验证脚本
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.sqlite');

console.log('🔍 检查数据库文件...\n');

if (fs.existsSync(dbFile)) {
    const stats = fs.statSync(dbFile);

    console.log('📊 数据库文件信息:');
    console.log('='.repeat(60));
    console.log('  文件路径:', dbFile);
    console.log('  文件大小:', stats.size, '字节');
    console.log('  最后修改:', stats.mtime.toLocaleString('zh-CN'));
    console.log('  创建时间:', stats.birthtime.toLocaleString('zh-CN'));
    console.log('='.repeat(60));

    console.log('\n📈 分析:');
    if (stats.size > 65536) {
        console.log('  ✅ 文件大小正常（> 64KB），应该包含数据');
        console.log('  ✅ 数据很可能已经保存');
    } else if (stats.size === 65536) {
        console.log('  ⚠️  文件大小为 64KB（初始大小）');
        console.log('  ⚠️  可能只有表结构，没有实际数据');
    } else {
        console.log('  ❌ 文件大小异常');
    }

    console.log('\n💡 建议:');
    console.log('  1. 使用 DB Browser for SQLite 打开文件');
    console.log('     下载地址: https://sqlitebrowser.org/dl/');
    console.log('  2. 或使用在线工具查看');
    console.log('     网址: https://sqliteviewer.app/');
    console.log('  3. 尝试登录之前注册的用户验证数据是否存在');

} else {
    console.log('❌ 数据库文件不存在！');
    console.log('   预期路径:', dbFile);
    console.log('\n💡 解决方法:');
    console.log('   启动项目一次，数据库文件会自动创建');
}

console.log('\n');
