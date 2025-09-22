#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking PDF Tools Website setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`\n📦 Node.js version: ${nodeVersion}`);
if (majorVersion >= 18) {
  console.log('✅ Node.js version is compatible');
} else {
  console.log('❌ Node.js version should be 18 or higher');
  allFilesExist = false;
}

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies not installed. Run: npm install');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 Setup looks good! You can run:');
  console.log('   npm run dev     - Start development server');
  console.log('   npm run build   - Build for production');
  console.log('   npm test        - Run tests');
} else {
  console.log('⚠️  Some issues found. Please fix them before running the app.');
}

console.log('\n📚 For more information, see README.md');