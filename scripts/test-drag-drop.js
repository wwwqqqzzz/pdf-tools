#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 拖拽上传功能测试脚本\n');

// 检查关键文件是否存在
const filesToCheck = [
  'app/split-pdf/SplitPDFClient.tsx',
  'app/compress-pdf/CompressPDFClient.tsx',
  'lib/pdf/compress.ts'
];

console.log('📋 检查关键文件...');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
  }
});

// 检查拖拽功能实现
console.log('\n🔍 检查拖拽功能实现...');

function checkDragDropImplementation(filePath, pageName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = {
      onDragOver: content.includes('onDragOver'),
      onDragLeave: content.includes('onDragLeave'),
      onDrop: content.includes('onDrop'),
      preventDefault: content.includes('preventDefault'),
      dataTransfer: content.includes('dataTransfer'),
      handleFileSelected: content.includes('handleFileSelected') || content.includes('handleFileInputChange')
    };
    
    console.log(`\n📄 ${pageName}:`);
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${check}`);
    });
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    console.log(`  📊 通过率: ${passedChecks}/${totalChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);
    
    return passedChecks === totalChecks;
    
  } catch (error) {
    console.log(`❌ 无法检查 ${pageName}: ${error.message}`);
    return false;
  }
}

const splitPageOK = checkDragDropImplementation('app/split-pdf/SplitPDFClient.tsx', 'PDF拆分页面');
const compressPageOK = checkDragDropImplementation('app/compress-pdf/CompressPDFClient.tsx', 'PDF压缩页面');

// 检查压缩算法改进
console.log('\n🔧 检查压缩算法改进...');
try {
  const compressContent = fs.readFileSync('lib/pdf/compress.ts', 'utf8');
  
  const compressionChecks = {
    performAdvancedCompress: compressContent.includes('performAdvancedCompress'),
    performAggressiveCompress: compressContent.includes('performAggressiveCompress'),
    getAggressiveCompressionSettings: compressContent.includes('getAggressiveCompressionSettings'),
    multipleStrategies: compressContent.includes('Promise.allSettled'),
    improvedSettings: compressContent.includes('objectsPerTick: 200')
  };
  
  Object.entries(compressionChecks).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  });
  
  const passedCompressionChecks = Object.values(compressionChecks).filter(Boolean).length;
  const totalCompressionChecks = Object.keys(compressionChecks).length;
  
  console.log(`  📊 压缩改进通过率: ${passedCompressionChecks}/${totalCompressionChecks} (${Math.round(passedCompressionChecks/totalCompressionChecks*100)}%)`);
  
} catch (error) {
  console.log(`❌ 无法检查压缩算法: ${error.message}`);
}

// 生成测试报告
console.log('\n📋 测试报告:');
console.log('='.repeat(50));

if (splitPageOK && compressPageOK) {
  console.log('✅ 拖拽功能实现: 完整');
} else {
  console.log('⚠️  拖拽功能实现: 需要检查');
}

console.log('\n🧪 手动测试步骤:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问 http://localhost:3000/split-pdf');
console.log('3. 尝试拖拽PDF文件到上传区域');
console.log('4. 访问 http://localhost:3000/compress-pdf');
console.log('5. 测试不同压缩级别的效果');

console.log('\n📚 详细测试指南: ./DRAG_DROP_TEST.md');

// 检查是否可以启动开发服务器
console.log('\n🚀 准备启动测试...');
console.log('运行以下命令开始测试:');
console.log('npm run dev');
console.log('然后在浏览器中测试拖拽功能');

console.log('\n✨ 测试脚本完成!');