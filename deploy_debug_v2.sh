#!/bin/bash

echo "🔧 部署强化验证修复 v2..."

# 提交更改
git add .
git commit -m "强化输入验证逻辑 - 修复空消息问题和键盘事件处理"

# 推送到GitHub
git push origin main

echo "✅ 强化验证修复已推送到GitHub"
echo "📡 Netlify将自动重新部署，请等待2-3分钟"
echo ""
echo "🎯 本次修复内容："
echo "  - 强化了前端输入验证，添加类型检查"
echo "  - 修复了键盘Enter事件的防抖机制"
echo "  - 过滤聊天历史中的空消息"
echo "  - 添加了详细的调试日志"
echo "  - 改进了错误处理逻辑"
echo ""
echo "🔍 调试信息："
echo "  - 现在会在控制台输出详细的验证信息"
echo "  - 输入验证失败时会记录具体原因"
echo "  - 聊天历史构建时会显示消息计数"
echo ""
echo "🧪 测试建议："
echo "  - 测试正常输入（如：你好）"
echo "  - 测试空格输入"
echo "  - 测试Enter键发送"
echo "  - 查看浏览器控制台的详细日志" 