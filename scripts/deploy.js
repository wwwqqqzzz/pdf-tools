#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PDF Tools Website - 快速部署脚本\n');

// 检查是否在项目根目录
if (!fs.existsSync('package.json')) {
  console.error('❌ 请在项目根目录运行此脚本');
  process.exit(1);
}

// 检查Git状态
console.log('📋 检查项目状态...');

try {
  // 检查是否有未提交的更改
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('📝 发现未提交的更改，正在提交...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Ready for deployment - $(date)"', { stdio: 'inherit' });
  }
  
  console.log('✅ Git状态检查完成');
} catch (error) {
  console.log('⚠️  Git未初始化，正在初始化...');
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit - PDF Tools v1.0"', { stdio: 'inherit' });
    console.log('✅ Git初始化完成');
  } catch (initError) {
    console.error('❌ Git初始化失败:', initError.message);
    process.exit(1);
  }\n}\n\n// 运行构建测试\nconsole.log('🏗️  运行构建测试...');\ntry {\n  execSync('npm run build', { stdio: 'inherit' });\n  console.log('✅ 构建测试通过');\n} catch (error) {\n  console.error('❌ 构建失败，请修复错误后重试');\n  process.exit(1);\n}\n\n// 检查Vercel CLI\nconsole.log('🔧 检查部署工具...');\ntry {\n  execSync('vercel --version', { stdio: 'pipe' });\n  console.log('✅ Vercel CLI已安装');\n  \n  // 询问是否要部署\n  console.log('\\n🚀 准备部署到Vercel...');\n  console.log('选择部署方式:');\n  console.log('1. 预览部署 (vercel)');\n  console.log('2. 生产部署 (vercel --prod)');\n  console.log('3. 跳过自动部署');\n  \n  const readline = require('readline');\n  const rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n  });\n  \n  rl.question('请选择 (1-3): ', (answer) => {\n    rl.close();\n    \n    switch (answer.trim()) {\n      case '1':\n        console.log('🚀 开始预览部署...');\n        execSync('vercel', { stdio: 'inherit' });\n        break;\n      case '2':\n        console.log('🚀 开始生产部署...');\n        execSync('vercel --prod', { stdio: 'inherit' });\n        break;\n      case '3':\n        console.log('⏭️  跳过自动部署');\n        showManualInstructions();\n        break;\n      default:\n        console.log('⏭️  无效选择，跳过自动部署');\n        showManualInstructions();\n    }\n    \n    console.log('\\n🎉 部署脚本完成！');\n    console.log('📖 查看完整部署指南: ./DEPLOYMENT_GUIDE.md');\n  });\n  \n} catch (error) {\n  console.log('⚠️  Vercel CLI未安装');\n  console.log('\\n📋 手动部署步骤:');\n  showManualInstructions();\n}\n\nfunction showManualInstructions() {\n  console.log('\\n📋 手动部署到Vercel:');\n  console.log('1. 访问 https://vercel.com');\n  console.log('2. 使用GitHub账号登录');\n  console.log('3. 点击 \"New Project\"');\n  console.log('4. 选择你的GitHub仓库');\n  console.log('5. 点击 \"Deploy\"');\n  console.log('\\n或者安装Vercel CLI:');\n  console.log('npm install -g vercel');\n  console.log('vercel login');\n  console.log('vercel --prod');\n  \n  console.log('\\n🔧 环境变量配置:');\n  console.log('在Vercel项目设置中添加以下环境变量:');\n  console.log('- NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app');\n  console.log('- NEXT_PUBLIC_SITE_NAME=PDF Tools');\n  console.log('- NODE_ENV=production');\n}\n\n// 显示项目信息\nconsole.log('\\n📊 项目信息:');\nconst packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));\nconsole.log(`- 项目名称: ${packageJson.name}`);\nconsole.log(`- 版本: ${packageJson.version}`);\nconsole.log(`- 描述: ${packageJson.description || 'PDF工具网站'}`);\n\n// 显示构建信息\nif (fs.existsSync('.next')) {\n  console.log('\\n🏗️  构建信息:');\n  console.log('- 构建状态: ✅ 成功');\n  console.log('- 输出目录: .next/');\n  console.log('- 静态文件: 已优化');\n}\n\nconsole.log('\\n🎯 可用功能:');\nconsole.log('- ✅ PDF合并 (/merge-pdf)');\nconsole.log('- ✅ PDF拆分 (/split-pdf)');\nconsole.log('- ✅ PDF压缩 (/compress-pdf)');\nconsole.log('- ✅ 隐私政策 (/privacy)');\nconsole.log('- ✅ 服务条款 (/terms)');\nconsole.log('- ✅ SEO优化 (sitemap.xml, robots.txt)');