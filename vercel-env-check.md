# Vercel 环境变量配置指南

## 问题诊断

你的 Google Analytics 无法检测到的主要原因可能是：

1. **环境变量未在 Vercel 中设置**
2. **域名配置不匹配**
3. **生产环境构建时环境变量未正确传递**

## 解决步骤

### 1. 在 Vercel Dashboard 中设置环境变量

访问你的 Vercel 项目设置页面，在 Environment Variables 部分添加：

```
NEXT_PUBLIC_GA_ID=G-H0794W951S
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SITE_URL=https://pdf-tools.20030727.xyz
NODE_ENV=production
```

### 2. 验证环境变量

部署后访问以下页面来验证配置：
- `https://pdf-tools.20030727.xyz/analytics-debug`
- `https://pdf-tools.20030727.xyz/test-ga`

### 3. 检查 Google Analytics 实时报告

1. 登录 Google Analytics
2. 进入实时报告
3. 访问你的网站
4. 查看是否有活动用户显示

### 4. 浏览器开发者工具检查

1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 刷新页面
4. 查找发送到 `google-analytics.com` 或 `googletagmanager.com` 的请求

### 5. 控制台日志检查

在浏览器控制台中应该能看到：
```
Google Analytics initialized with ID: G-H0794W951S
```

## 常见问题

### Q: 为什么 Google Analytics 检测不到代码？
A: 可能的原因：
- 环境变量未在 Vercel 中设置
- 代码只在生产环境加载，开发环境不会加载
- 网络请求被广告拦截器阻止

### Q: 如何确认代码已正确加载？
A: 
1. 查看页面源代码，确认包含 gtag 脚本
2. 在开发者工具 Network 标签中查看 GA 请求
3. 使用 Google Analytics Debugger 浏览器扩展

### Q: 实时报告中看不到数据怎么办？
A: 
1. 确认 GA 代码正确加载
2. 等待几分钟，实时数据可能有延迟
3. 检查是否被广告拦截器阻止
4. 确认 GA 属性配置正确

## 部署命令

```bash
# 检查环境变量
npm run check-env

# 构建并部署
npm run build
npm run deploy
```

## 验证清单

- [ ] Vercel 中设置了所有必需的环境变量
- [ ] 网站域名与配置匹配
- [ ] 页面源代码包含 gtag 脚本
- [ ] 浏览器网络请求显示 GA 调用
- [ ] Google Analytics 实时报告显示活动用户
- [ ] 控制台显示 GA 初始化日志