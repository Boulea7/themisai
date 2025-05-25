# 獬豸 Themis AI - Vercel 部署指南

## 部署前准备

### 1. 确保项目代码完整
确保你的项目包含以下关键文件：
- `package.json` - 项目依赖配置
- `next.config.ts` - Next.js 配置
- `vercel.json` - Vercel 部署配置
- `.env.example` - 环境变量示例
- `src/app/` - 应用源代码

### 2. 环境变量准备
你需要准备以下环境变量：
- `SILICONFLOW_API_KEY` - 你的 SiliconFlow API 密钥
- `SILICONFLOW_API_URL` - API 端点地址
- `SILICONFLOW_MODEL` - 使用的模型名称

## 部署方式

### 方式一：通过 GitHub 自动部署（推荐）

#### 步骤 1：将代码推送到 GitHub
```bash
# 在项目根目录下执行
git add .
git commit -m "准备部署到 Vercel - 项目结构已优化"
git push origin main
```

#### 步骤 2：连接 Vercel 和 GitHub
1. 访问 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

#### 步骤 3：配置项目设置
1. **Framework Preset**: 自动检测为 Next.js
2. **Root Directory**: 设置为 `.` (根目录)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

#### 步骤 4：设置环境变量
在 Vercel 项目设置中添加环境变量：
- `SILICONFLOW_API_KEY`: 你的实际 API 密钥
- `SILICONFLOW_API_URL`: `https://api.siliconflow.cn/v1/chat/completions`
- `SILICONFLOW_MODEL`: `Qwen/Qwen3-235B-A22B`

#### 步骤 5：部署
点击 "Deploy" 按钮，等待部署完成。

### 方式二：通过 Vercel CLI 部署

#### 步骤 1：安装 Vercel CLI
```bash
npm install -g vercel
```

#### 步骤 2：登录 Vercel
```bash
vercel login
```

#### 步骤 3：初始化项目
```bash
# 在项目根目录下执行
vercel
```

按照提示配置：
- Set up and deploy? `Y`
- Which scope? 选择你的账户
- Link to existing project? `N`
- What's your project's name? `themis-ai`
- In which directory is your code located? `./`

#### 步骤 4：设置环境变量
```bash
vercel env add SILICONFLOW_API_KEY
vercel env add SILICONFLOW_API_URL
vercel env add SILICONFLOW_MODEL
```

#### 步骤 5：部署到生产环境
```bash
vercel --prod
```

## 部署后验证

### 1. 检查网站访问
- 访问 Vercel 提供的域名
- 确保页面正常加载
- 测试聊天功能是否正常

### 2. 检查 API 功能
- 尝试发送消息给 AI
- 确保角色切换功能正常
- 验证所有交互功能

### 3. 性能检查
- 使用 Lighthouse 检查性能分数
- 确保移动端适配正常
- 检查加载速度

## 常见问题解决

### 1. 构建失败
- 检查 `package.json` 中的依赖版本
- 确保 TypeScript 类型检查通过
- 查看构建日志中的具体错误信息

### 2. API 调用失败
- 检查环境变量是否正确设置
- 验证 API 密钥是否有效
- 确认 API 端点地址正确

### 3. 样式问题
- 确保 Tailwind CSS 配置正确
- 检查 CSS 文件是否正确导入
- 验证响应式设计在不同设备上的表现

## 自定义域名（可选）

### 1. 在 Vercel 项目设置中添加域名
1. 进入项目设置
2. 点击 "Domains"
3. 添加你的自定义域名

### 2. 配置 DNS
根据 Vercel 提供的说明配置你的域名 DNS 记录。

## 持续部署

一旦设置完成，每次你向 GitHub 推送代码时，Vercel 会自动：
1. 检测代码变更
2. 运行构建过程
3. 部署新版本
4. 提供预览链接

## 监控和分析

Vercel 提供了丰富的监控功能：
- 访问统计
- 性能分析
- 错误日志
- 函数调用统计

你可以在 Vercel 控制台中查看这些信息。 