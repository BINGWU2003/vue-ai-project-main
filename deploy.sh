#!/bin/bash

# AI对话平台部署脚本

echo "🚀 开始部署 AI 对话平台..."

# 检查必要的工具
command -v docker >/dev/null 2>&1 || { echo "❌ 请先安装 Docker"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ 请先安装 Docker Compose"; exit 1; }

# 构建并启动服务
echo "📦 构建 Docker 镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 服务启动成功！"
    echo "🌐 访问地址: http://localhost"
    echo "📱 移动端体验: http://localhost (在移动浏览器中打开)"
    echo ""
    echo "🎯 快速测试:"
    echo "1. 访问 http://localhost 会自动跳转到聊天页面"
    echo "2. 首次访问会跳转到登录页面"
    echo "3. 点击'立即注册'创建新账户"
    echo "4. 注册成功后自动进入聊天界面"
    echo "5. 点击'新建对话'开始与AI对话"
    echo ""
    echo "📊 查看服务状态: docker-compose ps"
    echo "📋 查看日志: docker-compose logs -f"
    echo "🛑 停止服务: docker-compose down"
else
    echo "❌ 服务启动失败，请检查日志:"
    docker-compose logs
    exit 1
fi
