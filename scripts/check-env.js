#!/usr/bin/env node

// 检查环境变量的脚本
console.log('=== 环境变量检查 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_GA_ID:', process.env.NEXT_PUBLIC_GA_ID);
console.log('NEXT_PUBLIC_ENABLE_ANALYTICS:', process.env.NEXT_PUBLIC_ENABLE_ANALYTICS);
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

// 检查必需的环境变量
const requiredEnvVars = [
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_ENABLE_ANALYTICS',
  'NEXT_PUBLIC_SITE_URL'
];

let hasErrors = false;

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ 缺少环境变量: ${envVar}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${envVar}: ${process.env[envVar]}`);
  }
});

if (hasErrors) {
  console.error('\n❌ 存在缺失的环境变量，请检查配置');
  process.exit(1);
} else {
  console.log('\n✅ 所有必需的环境变量都已设置');
}

// 生产环境特殊检查
if (process.env.NODE_ENV === 'production') {
  console.log('\n=== 生产环境检查 ===');
  
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') {
    console.warn('⚠️  生产环境中 Analytics 未启用');
  }
  
  if (!process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_ID === 'your-ga-id') {
    console.error('❌ 生产环境中 Google Analytics ID 未正确设置');
    hasErrors = true;
  }
  
  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('✅ 生产环境配置正确');
  }
}