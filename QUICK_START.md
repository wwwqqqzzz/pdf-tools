# 🚀 Quick Start Guide

## 快速启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 打开浏览器
访问 [http://localhost:3000](http://localhost:3000)

## 🎯 测试功能

1. **首页**: http://localhost:3000
   - 查看所有可用的PDF工具

2. **PDF合并**: http://localhost:3000/merge-pdf
   - 上传多个PDF文件
   - 点击"合并"按钮
   - 下载合并后的PDF

## 🔧 如果遇到问题

### 常见错误修复

1. **端口被占用**:
   ```bash
   npm run dev -- -p 3001
   ```

2. **依赖问题**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript错误**:
   ```bash
   npm run type-check
   ```

### 检查设置
```bash
npm run check-setup
```

## 📁 项目结构

```
├── app/                    # 页面文件
│   ├── page.tsx           # 首页
│   └── merge-pdf/         # PDF合并页面
├── lib/                   # 工具函数
│   ├── pdf/              # PDF处理逻辑
│   └── utils/            # 通用工具
└── components/           # React组件
```

## 🎉 成功标志

如果看到以下内容，说明项目运行成功：
- 首页显示PDF工具网格
- 合并页面可以选择文件
- 没有控制台错误

## 📞 需要帮助？

查看详细文档：
- [README.md](./README.md) - 完整文档
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 故障排除