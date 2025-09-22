#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 开始构建测试...');

try {
  // 检查环境变量
  console.log('\n📋 检查环境变量:');
  execSync('npm run check-env', { stdio: 'inherit' });

  // 类型检查
  console.log('\n🔍 TypeScript 类型检查:');
  execSync('npm run type-check', { stdio: 'inherit' });

  // 代码检查
  console.log('\n🧹 ESLint 检查:');
  execSync('npm run lint', { stdio: 'inherit' });

  // 构建项目
  console.log('\n🏗️  构建项目:');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ 所有检查通过！项目构建成功。');
} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  process.exit(1);
}