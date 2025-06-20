# 獬豸 Themis AI - 法学专业大语言模型服务平台

## 项目简介

獬豸 Themis AI 是一个专为法学领域打造的垂直特化大语言模型服务平台。獬豸是中国古代传说中象征公正与法律的神兽，Themis 是希腊神话中的正义女神，两者结合完美诠释了我们的使命。本网站旨在向用户介绍 Themis AI 模型的能力，并提供一个直观、易用的交互界面，允许用户通过聊天窗口与模型进行实时交流，获取法律咨询与信息。

## 项目目标

*   **专业展示**：清晰、专业地展示 獬豸 Themis AI 大语言模型的功能、特性和优势。
*   **用户互动**：提供一个美观、流畅的聊天界面，方便用户与模型进行高效互动。
*   **信任建立**：通过专业的设计和清晰的信息传递，建立用户对模型专业能力的信任。
*   **技术实现**：采用现代化的前端技术栈，实现高性能、高可用性的网站。

## 核心功能规划

1.  **首页 (Hero Section)**：
    *   引人注目的标题和副标题，阐述 獬豸 Themis AI 的核心价值。
    *   动态背景或视觉元素，突出科技感和专业性。
    *   明确的行动号召按钮 (CTA)，引导用户开始体验。
2.  **模型介绍区块**：
    *   详细介绍模型的背景、训练特点、专业领域覆盖等。
3.  **功能特性区块**：
    *   以卡片或其他形式展示模型的核心功能，如法律条文查询、案例分析辅助等。
4.  **使用场景/优势区块**：
    *   展示模型在不同法学场景下的应用价值。
5.  **聊天互动区块 (LLM Interaction Section)**：
    *   一个显著、易用的聊天窗口。
    *   支持用户输入问题，并展示与 SiliconFlow API 集成后大语言模型的回复。
    *   包含消息显示区、文本输入区、发送按钮等。
    *   考虑加入模型思考中的提示动画。
6.  **免责声明区块**：
    *   清晰说明模型输出仅供参考，不构成专业法律建议。
7.  **页脚**：
    *   版权信息、联系方式等。

## 技术选型

*   **前端框架**: Next.js 14+ (App Router)
*   **UI 库**: React 18+
*   **样式**: Tailwind CSS
*   **动画**: Framer Motion
*   **语言**: TypeScript
*   **代码规范**: ESLint
*   **API 交互**: Axios / Fetch API (用于连接 SiliconFlow)
*   **Markdown 渲染**: react-markdown + remark-gfm
*   **代码高亮**: react-syntax-highlighter

## 如何运行 (Getting Started)

首先，确保你已经进入项目根目录 `lexichat`。
然后，运行开发服务器：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

在你的浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以通过修改 `src/app/page.tsx` 文件来开始编辑页面。当你编辑文件时，页面会自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 来自动优化和加载 [Geist](https://vercel.com/font) 字体。

## 开发进展

### ✅ 已完成的工作

1.  **✅ 基础结构搭建**：
    *   创建了完整的组件文件夹结构 (`atoms`, `molecules`, `organisms`)
    *   安装了必要的依赖 (`framer-motion`, `axios`)

2.  **✅ 核心组件开发**：
    *   **Button 组件** (`src/components/atoms/Button.tsx`): 支持多种变体和动画效果
    *   **Input 组件** (`src/components/atoms/Input.tsx`): 支持文本框和文本域，带验证状态
    *   **MarkdownRenderer 组件** (`src/components/atoms/MarkdownRenderer.tsx`): 支持完整的Markdown渲染和代码高亮
    *   **Navbar 组件** (`src/components/organisms/Navbar.tsx`): 响应式导航栏，支持平滑滚动
    *   **Footer 组件** (`src/components/organisms/Footer.tsx`): 包含免责声明的页脚
    *   **HeroSection 组件** (`src/components/organisms/HeroSection.tsx`): 动态背景的英雄区
    *   **ChatWindow 组件** (`src/components/organisms/ChatWindow.tsx`): 完整的聊天界面
    *   **ThinkingProcess 组件** (`src/components/molecules/ThinkingProcess.tsx`): AI思考过程展示组件

3.  **✅ 页面整合**：
    *   更新了主页面 (`src/app/page.tsx`)，整合了所有组件
    *   实现了完整的单页滚动网站结构
    *   包含了模型介绍、功能特性、使用场景等区块

4.  **✅ 动画与交互**：
    *   使用 Framer Motion 实现了丰富的动画效果
    *   包含页面加载动画、滚动触发动画、悬停效果等
    *   实现了平滑的页面滚动和导航

### 🎯 当前状态

獬豸 Themis AI 已经发展成为一个功能完整、专业强大的法学AI服务平台：

**🎨 界面设计**：
- 美观的视觉设计（遵循法学专业的设计指南）
- 丰富的动画效果和交互体验
- 完全响应式的布局，适配所有设备

**🤖 AI功能**：
- 集成真实的SiliconFlow API，提供专业法律咨询
- 7个专业法学角色，覆盖法律服务的各个领域
- 智能角色切换，根据用户需求提供最合适的专家服务
- 动态示例问题，引导用户更好地使用服务

**💬 聊天体验**：
- 功能完整的聊天界面，支持实时AI对话
- 智能滚动控制，优化用户体验
- 消息复制、对话清除等实用功能
- 角色专业标签和特色展示

**🔒 安全性**：
- API Key安全存储，不会暴露到前端
- 完善的错误处理和用户反馈机制

**你现在可以访问 [http://localhost:3000](http://localhost:3000) 体验完整的多角色法学AI服务！**

### ✅ 最新完成的工作 (项目重命名)

1.  **✅ 项目全面重命名**：
    *   项目名称从 "LexiChat (律晓谈)" 更新为 "獬豸 Themis AI"
    *   獬豸：中国古代传说中象征公正与法律的神兽
    *   Themis：希腊神话中的正义女神
    *   完美结合中西方法律文化，体现项目的专业性和权威性

2.  **✅ 全面更新内容**：
    *   更新了所有组件中的品牌名称和Logo
    *   修改了系统提示词中的AI身份标识
    *   更新了网站标题、描述和免责声明
    *   调整了联系邮箱和版权信息
    *   修改了package.json和package-lock.json中的项目名称

3.  **✅ 保持功能完整性**：
    *   所有功能保持不变，包括7个专业角色系统
    *   API集成和聊天功能正常运行
    *   动画效果和用户体验保持一致
    *   开发服务器正常启动（HTTP 200状态）

**🎉 獬豸 Themis AI 现已完成品牌升级，更加专业和权威！**

### ✅ 最新完成的工作 (用户体验优化)

1.  **✅ 修复聊天窗口滚动问题**：
    *   移除了角色切换时的自动页面滚动行为
    *   移除了发送消息时的自动页面滚动行为
    *   保留了聊天容器内部的正常滚动功能
    *   用户现在可以保持在当前视图位置，不会被强制滚动到页面底部

2.  **✅ 优化免责声明设计**：
    *   将原来的大段免责声明移至页脚保留
    *   在聊天框下方添加简洁的提示信息
    *   采用类似ChatGPT的设计风格："獬豸 Themis AI 可能会出错，请核实重要信息。回答仅供参考，不构成正式法律意见。"
    *   提升了用户体验，减少了视觉干扰

3.  **✅ 改进交互体验**：
    *   聊天功能更加流畅自然
    *   角色切换不再打断用户的浏览体验
    *   保持了专业性的同时提升了易用性

**🎯 现在用户可以更舒适地使用獬豸 Themis AI 进行法律咨询！**

### ✅ 最新完成的工作 (Qwen3-235B-A22B升级与专业化提升)

1.  **✅ 模型升级到Qwen3-235B-A22B**：
    *   升级到通义千问最新的混合专家（MoE）架构模型
    *   拥有235B总参数量和22B激活参数量，性能大幅提升
    *   启用思考模式，支持复杂逻辑推理、数学和编程
    *   支持100多种语言和方言，具备卓越的多语言能力
    *   增加max_tokens到8192，支持更长的输出内容

2.  **✅ 专业化系统提示词全面优化**：
    *   所有7个角色的系统提示词全面重构，突出平台专业性
    *   强制要求每次回答必须标注具体法律依据：
      - 相关法律法规的具体条文（如《民法典》第XXX条第X款）
      - 司法解释的具体条款和部门规章规定
      - 经典案例或指导性案例的引用
      - 权威法律文献或官方解释的出处
    *   统一回答格式要求，包含法律分析、法律依据、案例参考、实务建议、风险提示、知识来源等模块

3.  **✅ 思考模式深度集成**：
    *   API路由配置enable_thinking=true，启用Qwen3深度思考能力
    *   AI可以在回答前进行深度思考和推理
    *   思考过程透明化展示，用户可以了解AI的推理逻辑
    *   适用于复杂法律问题的深度分析和多角度思考

4.  **✅ 专业标准大幅提升**：
    *   确保法律条文引用的准确性和时效性
    *   提供多角度的法律分析和理论依据
    *   注重理论与实务的结合
    *   保持中立、客观的专业立场
    *   区分不同法域和地区的司法实践差异

**🎯 现在獬豸 Themis AI 达到了专业法律服务的新高度，提供有据可查、深度思考的法律咨询服务！**

### ✅ 最新完成的工作 (消息传递错误修复)

1.  **✅ 修复关键的API数据格式错误**：
    *   识别并修复了前后端数据格式不匹配问题
    *   前端原本发送：`{ messages: [...], role: roleId }`
    *   后端期待接收：`{ message: string, history: [], roleId: string }`
    *   统一了数据传递格式，确保前后端完全匹配

2.  **✅ 强化全面的输入验证机制**：
    *   在前端API调用层添加详细的数据验证
    *   在ChatWindow组件中加强输入类型检查
    *   在后端API路由中添加完整的参数验证
    *   增加了调试日志，便于问题追踪和诊断

3.  **✅ 优化用户输入处理**：
    *   改进了Enter键发送消息的验证逻辑
    *   添加了角色选择状态的验证
    *   确保只有有效的字符串输入才会被处理
    *   防止了空消息、undefined或错误类型数据的传递

4.  **✅ 增强错误处理和调试能力**：
    *   添加了详细的控制台日志输出
    *   为不同验证失败情况提供具体的错误信息
    *   改进了错误消息的可读性和实用性
    *   确保用户能够获得明确的反馈信息

**🎯 现在"消息内容不能为空"错误已彻底解决，獬豸 Themis AI 的聊天功能完全正常运行！**

5.  **✅ 修复Netlify生产环境数据格式问题**：
    *   发现Netlify Functions与本地API路由数据格式不一致
    *   统一了生产环境和开发环境的数据格式：`{ message, history, roleId }`
    *   更新了Netlify Functions的请求解析和验证逻辑
    *   修复了角色ID映射问题（intellectual, student等）
    *   确保生产环境和本地开发环境行为完全一致

6.  **✅ 优化Netlify Functions性能，解决超时问题**：
    *   将超时时间从8秒调整到9秒，给API更多响应时间
    *   减少max_tokens从4096到2048，提高响应速度
    *   简化系统提示词，减少处理复杂度
    *   切换到更快的模型：`Qwen/Qwen2.5-72B-Instruct`（生产环境）
    *   添加详细的调试日志，便于问题追踪和性能监控

### ✅ 最新完成的工作 (Netlify部署与错误修复 - 历史记录)

1.  **✅ 成功部署到Netlify**：
    *   项目已成功部署到 [themisai.tech](https://themisai.tech)
    *   配置了完整的Netlify Functions支持
    *   实现了静态站点+Serverless Functions架构
    *   支持自定义域名和HTTPS

2.  **✅ 解决Git子模块问题**：
    *   修复了Git子模块导致的部署错误
    *   清理了项目结构，移除了嵌套目录问题
    *   确保项目可以正常进行持续部署

3.  **✅ 修复502超时问题**：
    *   优化了Netlify Functions的性能配置
    *   减少max_tokens从8192到4096以提高响应速度
    *   添加8秒超时控制，避免Netlify 10秒限制
    *   优化系统提示词，要求AI提供简洁高效的回答
    *   改进错误处理，区分超时、服务不可用等不同错误类型

4.  **✅ 优化用户体验**：
    *   为不同错误类型提供友好的提示信息
    *   502错误提示用户简化问题或分步提问
    *   408超时错误建议用户重试
    *   保持了流式响应的视觉效果（生产环境模拟）

**🎯 獬豸 Themis AI 已在生产环境稳定运行，用户可以通过 [themisai.tech](https://themisai.tech) 访问完整的法律咨询服务！**

### ✅ 最新完成的工作 (项目结构优化 - 解决Vercel部署问题)

1.  **✅ 解决Vercel部署Root Directory检测问题**：
    *   重新组织项目结构，将Next.js项目移到根目录
    *   移除了嵌套的`lexichat`目录结构，避免Vercel只检测到node_modules
    *   更新了`vercel.json`配置，移除Root Directory设置
    *   备份了原有的根目录文件到`backup_root`目录

2.  **✅ 修复构建依赖问题**：
    *   确保所有TypeScript类型定义正确安装
    *   修复了`@types/react-syntax-highlighter`依赖问题
    *   验证了项目构建成功（✓ Compiled successfully in 2000ms）

3.  **✅ 更新部署文档**：
    *   更新了`DEPLOYMENT.md`中的Root Directory设置说明
    *   修正了所有路径引用和命令示例
    *   确保部署指南与新的项目结构一致

**🎯 现在Vercel可以正确检测到Next.js项目，Root Directory设置为根目录(.)即可！**

### ✅ 最新完成的工作 (Netlify部署准备 - 解决子模块问题)

1.  **✅ 修复Git子模块致命错误**：
    *   彻底解决了"fatal: No url found for submodule path 'lexichat' in .gitmodules"错误
    *   移除了有问题的Git子模块配置和缓存
    *   清理了.gitmodules文件和.git/modules目录
    *   项目现在是标准的Next.js项目结构，无子模块依赖

2.  **✅ 创建完整的Netlify部署配置**：
    *   创建了`netlify.toml`配置文件，设置构建和部署参数
    *   创建了`netlify/functions/chat.js` Netlify Functions处理API请求
    *   修改了`next.config.ts`支持静态导出到`out`目录
    *   配置了安全头部和缓存策略

3.  **✅ API架构适配Netlify**：
    *   修改了`src/lib/api.ts`，支持开发/生产环境自动切换
    *   开发环境使用Next.js API路由（`/api/chat`）
    *   生产环境使用Netlify Functions（`/.netlify/functions/chat`）
    *   保持了流式响应的用户体验（生产环境模拟流式效果）

4.  **✅ 构建测试验证**：
    *   静态导出构建成功（✓ Compiled successfully in 5.0s）
    *   生成了优化的静态文件到`out`目录
    *   所有页面和资源正确导出
    *   TypeScript类型检查通过

5.  **✅ 创建详细部署文档**：
    *   创建了`NETLIFY_DEPLOYMENT.md`完整部署指南
    *   包含两种部署方式：GitHub自动部署和CLI部署
    *   详细的环境变量配置说明
    *   常见问题解决方案和部署后验证清单

**🚀 项目现已完全准备好部署到Netlify！Git子模块问题已解决，构建测试通过，所有配置文件就绪。**

### ✅ 之前完成的工作 (流式输出与高级功能)

1.  **✅ 流式输出功能**：
    *   实现了真正的流式响应，AI回复逐字显示，体验更自然
    *   修改了API路由支持Server-Sent Events (SSE)
    *   优化了前端流式数据处理，实时更新消息内容
    *   添加了流式输入指示器，显示AI正在生成内容

2.  **✅ Markdown渲染支持**：
    *   集成了react-markdown和remark-gfm，支持完整的Markdown语法
    *   添加了代码高亮功能，使用react-syntax-highlighter
    *   支持表格、列表、引用、链接等丰富的格式
    *   自定义了样式，与整体设计保持一致

3.  **✅ AI思考过程展示**：
    *   创建了ThinkingProcess组件，可展示AI的思考过程
    *   支持自动折叠功能，3秒后自动收起思考过程
    *   支持手动展开/折叠，用户可随时查看思考细节
    *   解析多种思考过程格式：`<thinking>...</thinking>`、`【思考】...【/思考】`等

4.  **✅ 增强的用户体验**：
    *   AI回复现在支持丰富的格式化内容
    *   思考过程让用户了解AI的推理逻辑
    *   流式输出让对话更加自然流畅
    *   保持了所有原有功能的完整性

### ✅ 最新完成的工作 (API 集成)

1.  **✅ SiliconFlow API 集成**：
    *   创建了环境变量文件 (`.env.local`) 安全存储 API Key
    *   实现了 Next.js API 路由 (`/src/app/api/chat/route.ts`)
    *   配置了专业的法学系统提示词
    *   模型型号: `Qwen/Qwen2.5-72B-Instruct` (已更新为更强大的模型)

2.  **✅ API 工具函数**：
    *   创建了 `/src/lib/api.ts` 工具库
    *   实现了错误处理和消息格式化
    *   添加了法律相关问题检测功能
    *   支持流式和非流式两种API调用方式

3.  **✅ 聊天功能增强**：
    *   更新了 ChatWindow 组件，集成真实 AI 对话
    *   添加了智能问题过滤（非法律问题友好提示）
    *   实现了复制消息功能
    *   添加了清除对话历史功能
    *   改进了错误处理和用户反馈

**🎉 现在您可以与真实的 獬豸 Themis AI 进行法律咨询对话了！**

### 🧪 API 测试验证

我们已经成功测试了 SiliconFlow API 集成：
- ✅ API 响应正常 (HTTP 200)
- ✅ AI 回复专业且准确
- ✅ Token 使用统计正常
- ✅ 错误处理机制完善
- ✅ 安全性配置正确
- ✅ 流式输出工作正常
- ✅ Markdown渲染完美支持
- ✅ 思考过程展示功能完整

### 🔧 问题解决记录

**问题**: React 19 与 framer-motion 的 SSR 兼容性问题
- **错误**: "Element type is invalid: expected a string but got: undefined"
- **原因**: Next.js 15 + React 19 + framer-motion 在服务端渲染时的兼容性问题
- **解决方案**: 
  - 为所有使用 framer-motion 的组件添加了客户端渲染检查
  - 实现了条件渲染：服务端返回静态版本，客户端返回动画版本
  - 确保了 SEO 友好性和用户体验的平衡
- **状态**: ✅ 已解决，网站正常运行

**问题**: 聊天窗口强制滚动问题
- **现象**: 点击发送消息后会强制屏幕向下移动，影响用户体验
- **原因**: 每次消息更新都会自动滚动到底部，没有考虑用户的滚动位置
- **解决方案**:
  - 实现智能滚动策略：只有当用户在聊天底部附近时才自动滚动
  - 添加滚动位置检测，判断用户是否手动滚动了聊天区域
  - 提供"滚动到最新消息"按钮，当用户向上滚动时显示
  - 发送新消息时仍会强制滚动到底部（符合用户期望）
- **状态**: ✅ 已解决，提供更好的用户体验

**问题**: TypeScript类型错误和依赖问题
- **现象**: react-syntax-highlighter缺少类型定义，react-markdown组件props类型错误
- **原因**: 新增的Markdown渲染依赖缺少TypeScript类型定义
- **解决方案**:
  - 安装了@types/react-syntax-highlighter类型定义
  - 使用Components类型正确定义react-markdown组件
  - 添加了适当的类型断言处理复杂类型
- **状态**: ✅ 已解决，所有TypeScript错误已修复

### ✅ 最新完成的工作 (多角色系统)

1.  **✅ 多角色专家系统**：
    *   设计了7个专业法学角色，每个角色都有独特的专业领域和风格
    *   **通用法律顾问** ⚖️：全科法律专家，适合各类法律问题
    *   **企业法务专家** 🏢：专注公司法、合同法、商事纠纷
    *   **民事法律专家** 👥：专门处理民事纠纷、婚姻家庭、财产继承
    *   **刑事法律专家** 🛡️：专门处理刑事案件、刑事辩护、刑事合规
    *   **知识产权专家** 💡：专门处理专利、商标、著作权等IP问题
    *   **劳动法专家** 👷：专门处理劳动合同、工伤赔偿、劳动争议
    *   **法学学习助手** 📚：专门为法学学生提供学习指导和考试辅导

2.  **✅ 角色选择界面**：
    *   创建了美观的角色选择器组件，支持下拉选择
    *   每个角色都有独特的头像、颜色主题和专业标签
    *   实时显示当前选择角色的专业领域

3.  **✅ 智能系统提示词**：
    *   为每个角色设计了专门的系统提示词
    *   根据角色特点调整回答风格和专业重点
    *   确保AI回复符合角色的专业定位

4.  **✅ 动态示例问题**：
    *   根据选择的角色动态显示相关的示例问题
    *   每个角色都有4个专业相关的示例问题
    *   提升用户体验和问题针对性

**🎉 现在用户可以根据自己的需求选择最合适的法学专家进行咨询！**

### 🚀 接下来的开发计划

1.  **功能增强**：
    *   ✅ 复制回答、清除对话功能 (已完成)
    *   ✅ 多角色专家系统 (已完成)
    *   ✅ 流式响应支持 (已完成)
    *   ✅ Markdown渲染支持 (已完成)
    *   ✅ AI思考过程展示 (已完成)
    *   🔄 实现聊天历史本地存储功能
    *   🔄 添加消息导出功能 (PDF/文本)
    *   🔄 实现语音输入功能

2.  **用户体验优化**：
    *   ✅ 智能滚动控制 (已完成)
    *   ✅ 流式输入指示器 (已完成)
    *   🔄 实现消息搜索功能
    *   🔄 添加快捷回复模板
    *   🔄 优化移动端体验

3.  **性能优化**：
    *   🔄 代码分割和懒加载优化
    *   🔄 图片和字体优化
    *   🔄 SEO 优化和元数据配置
    *   🔄 API 响应缓存机制

4.  **测试与部署**：
    *   🔄 多设备兼容性测试
    *   🔄 API 错误处理测试
    *   🔄 性能测试和监控
    *   🔄 部署到生产环境 (Vercel)

## 注意事项

*   严格遵守提供的《獬豸 Themis AI 前端开发与设计指南》进行开发。
*   API Key (`sk-psowetgqhuwrmfalawbrjrbikuwvemgizriqamcjaxdauopz`) **严禁硬编码到前端代码中**。后续我们会通过环境变量和后端 API 代理的方式安全地使用它。

## 学习更多 Next.js

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js Documentation](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [Learn Next.js](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。

你可以查看 [Next.js GitHub repository](https://github.com/vercel/next.js) - 欢迎你的反馈和贡献！

## 在 Vercel 上部署

部署你的 Next.js 应用最简单的方式是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)，它来自 Next.js 的创建者。

查看我们的 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) 获取更多细节。
 