#!/bin/bash

echo "🔧 部署Netlify Functions超时修复..."

# 提交更改
git add .
git commit -m "修复Netlify Functions超时问题 - 优化性能和错误处理"

# 推送到GitHub
git push origin main

echo "✅ 修复已推送到GitHub"
echo "📡 Netlify将自动重新部署，请等待2-3分钟"
echo ""
echo "🎯 修复内容："
echo "  - 减少max_tokens从8192到4096，提高响应速度"
echo "  - 添加8秒超时控制，避免Netlify 10秒限制"
echo "  - 优化系统提示词，要求AI简洁回答"
echo "  - 改进错误处理，提供更友好的错误信息"
echo ""
echo "💡 使用建议："
echo "  - 尽量提出简洁明确的法律问题"
echo "  - 复杂问题可以分步骤提问"
echo "  - 如果仍有502错误，请稍后重试" 