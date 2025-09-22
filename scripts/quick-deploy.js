#!/usr/bin/env node

/**
 * PDF工具网站快速部署脚本
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PDF工具网站快速部署脚本');
console.log('================================');

// 检查环境
console.log('📋 检查部署环境...');

try {
  // 检查Node.js版本
  const nodeVersion = process.version;
  console.log(`✅ Node.js版本: ${nodeVersion}`);
  
  if (parseInt(nodeVersion.slice(1)) < 18) {
    console.log('❌ 需要Node.js 18或更高版本');
    process.exit(1);
  }

  // 检查必要文件
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'public/pdf.worker.min.js'
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - 文件缺失`);
      if (file === 'public/pdf.worker.min.js') {
        console.log('正在下载PDF.js worker文件...');
        try {
          execSync('curl -o public/pdf.worker.min.js https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', { stdio: 'inherit' });
          console.log('✅ PDF.js worker文件下载完成');
        } catch (error) {
          console.log('❌ PDF.js worker文件下载失败');
          process.exit(1);
        }
      } else {
        process.exit(1);
      }
    }
  });

  console.log('\n🔧 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🏗️  构建项目...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ 构建成功！');
  
  console.log('\n🎯 部署选项:');
  console.log('1. Vercel部署 (推荐)');
  console.log('   - 安装Vercel CLI: npm i -g vercel');
  console.log('   - 部署: vercel --prod');
  console.log('');
  console.log('2. 本地测试');
  console.log('   - 启动: npm start');
  console.log('   - 访问: http://localhost:3000');
  console.log('');
  console.log('3. 其他平台');
  console.log('   - Netlify: 连接GitHub仓库自动部署');
  console.log('   - 自托管: 上传.next文件夹到服务器');

  console.log('\n📊 构建统计:');
  
  // 读取构建统计
  const buildDir = '.next';
  if (fs.existsSync(buildDir)) {
    const stats = fs.statSync(buildDir);
    console.log(`✅ 构建目录大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }

  // 检查页面
  const pagesDir = '.next/server/app';
  if (fs.existsSync(pagesDir)) {
    const pages = fs.readdirSync(pagesDir).filter(f => 
      fs.statSync(path.join(pagesDir, f)).isDirectory()
    );
    console.log(`✅ 生成页面数: ${pages.length}`);
  }

  console.log('\n🎉 部署准备完成！');
  console.log('你的PDF工具网站已经准备好部署了。');
  console.log('');
  console.log('📋 下一步:');
  console.log('1. 选择部署平台 (推荐Vercel)');
  console.log('2. 配置自定义域名');
  console.log('3. 设置Google Analytics');
  console.log('4. 提交到搜索引擎');
  console.log('5. 开始收集用户反馈');

} catch (error) {
  console.error('❌ 部署过程中出现错误:', error.message);
  console.log('\n🔧 故障排除:');
  console.log('1. 检查Node.js版本 (需要18+)');
  console.log('2. 检查网络连接');
  console.log('3. 清理node_modules: rm -rf node_modules && npm install');
  console.log('4. 检查磁盘空间');
  process.exit(1);
}