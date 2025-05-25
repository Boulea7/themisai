# 獬豸 Themis AI - Netlify 部署指南

## 🎯 部署前准备

### ✅ 已完成的准备工作

1. **✅ 修复Git子模块问题**：
   - 移除了有问题的`lexichat`子模块配置
   - 清理了Git配置，避免Netlify部署错误
   - 项目结构已优化为标准的Next.js项目

2. **✅ 创建Netlify配置**：
   - `netlify.toml` - Netlify部署配置文件
   - `netlify/functions/chat.js` - Netlify Functions API处理
   - 修改了`next.config.ts`支持静态导出

3. **✅ 代码规范化**：
   - 修改了API调用逻辑，支持Netlify Functions
   - 构建测试通过（✓ Compiled successfully）
   - 所有依赖正确安装

## 🚀 部署步骤

### 方式一：通过GitHub自动部署（推荐）

#### 步骤1：推送代码到GitHub
```bash
# 确保所有更改已提交
git add .
git commit -m "准备Netlify部署 - 修复子模块问题"
git push origin main
```

#### 步骤2：连接Netlify和GitHub
1. 访问 [Netlify官网](https://netlify.com)
2. 使用GitHub账号登录
3. 点击 "New site from Git"
4. 选择 "GitHub"
5. 选择你的仓库 `themisai`

#### 步骤3：配置构建设置
Netlify会自动检测到`netlify.toml`配置文件，但请确认以下设置：

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Functions directory**: `netlify/functions`

#### 步骤4：设置环境变量
在Netlify项目设置中添加以下环境变量：

1. 进入 **Site settings** > **Environment variables**
2. 添加以下变量：
   - `SILICONFLOW_API_KEY`: `你的SiliconFlow API密钥`
   - `SILICONFLOW_API_URL`: `https://api.siliconflow.cn/v1/chat/completions`
   - `SILICONFLOW_MODEL`: `Qwen/Qwen3-235B-A22B`

#### 步骤5：部署
点击 "Deploy site" 按钮，等待部署完成。

### 方式二：通过Netlify CLI部署

#### 步骤1：安装Netlify CLI
```bash
npm install -g netlify-cli
```

#### 步骤2：登录Netlify
```bash
netlify login
```

#### 步骤3：初始化项目
```bash
netlify init
```

按照提示配置：
- Create & configure a new site? `Y`
- Team: 选择你的团队
- Site name: `themis-ai`
- Build command: `npm run build`
- Directory to deploy: `out`
- Functions directory: `netlify/functions`

#### 步骤4：设置环境变量
```bash
netlify env:set SILICONFLOW_API_KEY "你的API密钥"
netlify env:set SILICONFLOW_API_URL "https://api.siliconflow.cn/v1/chat/completions"
netlify env:set SILICONFLOW_MODEL "Qwen/Qwen3-235B-A22B"
```

#### 步骤5：部署
```bash
netlify deploy --prod
```

## 🔧 技术架构说明

### 静态站点 + Serverless Functions
- **前端**: Next.js静态导出，部署为静态文件
- **API**: Netlify Functions处理聊天请求
- **优势**: 
  - 快速加载（静态文件）
  - 无服务器成本优化
  - 自动扩展

### API路由适配
- **开发环境**: 使用Next.js API路由 (`/api/chat`)
- **生产环境**: 使用Netlify Functions (`/.netlify/functions/chat`)
- **自动检测**: 代码会根据环境自动选择正确的API端点

### 流式响应处理
- **开发环境**: 真正的流式响应（Server-Sent Events）
- **生产环境**: 模拟流式效果（逐字显示）
- **用户体验**: 保持一致的交互体验

## 📋 部署后验证

### 1. 基础功能检查
- [ ] 网站正常加载
- [ ] 页面导航正常
- [ ] 响应式设计正常

### 2. AI聊天功能检查
- [ ] 角色选择功能正常
- [ ] 发送消息功能正常
- [ ] AI回复显示正常
- [ ] 流式输出效果正常

### 3. 性能检查
- [ ] 页面加载速度快
- [ ] API响应时间合理
- [ ] 移动端体验良好

## 🐛 常见问题解决

### 1. 构建失败
**问题**: Build command failed
**解决方案**:
- 检查`package.json`中的依赖版本
- 确保Node.js版本为18+
- 查看构建日志中的具体错误

### 2. API调用失败
**问题**: Functions调用返回错误
**解决方案**:
- 检查环境变量是否正确设置
- 验证API密钥是否有效
- 查看Functions日志

### 3. 静态导出问题
**问题**: 某些页面无法正常导出
**解决方案**:
- 确保没有使用服务端特性
- 检查`next.config.ts`配置
- 移除动态路由或API依赖

## 🔒 安全配置

### 环境变量安全
- ✅ API密钥存储在Netlify环境变量中
- ✅ 前端代码不包含敏感信息
- ✅ CORS配置正确

### 头部安全设置
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin

## 📊 监控和分析

### Netlify Analytics
- 访问统计
- 性能监控
- 错误日志
- Functions使用情况

### 自定义域名（可选）
1. 在Netlify项目设置中添加域名
2. 配置DNS记录
3. 启用HTTPS（自动）

## 🎉 部署完成

部署成功后，你将获得：
- 一个Netlify提供的域名（如：`https://themis-ai.netlify.app`）
- 自动HTTPS证书
- 全球CDN加速
- 自动部署（每次推送代码）

**🎯 现在獬豸 Themis AI 已经成功部署到Netlify，可以为全球用户提供专业的法律AI服务！** 