#!/bin/bash

echo "修复Git子模块问题..."

# 进入项目根目录
cd /Users/jialinli/lawtest

# 移除Git子模块配置
echo "移除Git子模块配置..."
git submodule deinit -f lexichat 2>/dev/null || true
git rm -f lexichat 2>/dev/null || true

# 删除.gitmodules文件（如果存在）
rm -f .gitmodules

# 删除Git子模块缓存
rm -rf .git/modules/lexichat

# 删除空的lexichat目录
rm -rf lexichat

# 添加所有文件到Git
echo "添加文件到Git..."
git add .

# 提交更改
echo "提交更改..."
git commit -m "修复Git子模块问题，准备Netlify部署"

echo "Git子模块问题已修复！"
echo "现在可以推送到GitHub并在Netlify部署了。" 