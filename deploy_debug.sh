#!/bin/bash

echo "🔧 部署调试修复..."

# 提交更改
git add .
git commit -m "修复'消息内容不能为空'错误 - 添加详细验证和调试日志"

# 推送到GitHub
git push origin main

echo "✅ 调试修复已推送到GitHub"
echo "📡 Netlify将自动重新部署，请等待2-3分钟"
echo ""
echo "🎯 修复内容："
echo "  - 添加了详细的输入验证"
echo "  - 增加了调试日志以便排查问题"
echo "  - 改进了错误处理和JSON解析"
echo "  - 前端添加了数据验证"
echo ""
echo "🔍 调试建议："
echo "  - 部署完成后，在Netlify Functions日志中查看详细错误信息"
echo "  - 测试时可以打开浏览器开发者工具查看网络请求"
echo "  - 如果问题持续，请检查发送的消息格式" 