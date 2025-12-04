#!/bin/bash

# Hugging Face Spaces 部署脚本
# 使用方法: ./deploy_to_huggingface.sh <SPACE_NAME> <HF_TOKEN>

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查参数
if [ "$#" -lt 2 ]; then
    echo -e "${RED}错误: 缺少必需参数${NC}"
    echo "使用方法: $0 <SPACE_NAME> <HF_TOKEN>"
    echo "示例: $0 antigravity-gateway hf_xxxxxxxxxxxxxxxxxxxx"
    exit 1
fi

SPACE_NAME=$1
HF_TOKEN=$2

# 从 token 中提取用户名（如果可能）
echo -e "${YELLOW}正在准备部署到 Hugging Face Spaces...${NC}"

# 检查是否安装了 git
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: 未安装 git${NC}"
    exit 1
fi

# 获取当前 git 用户信息
GIT_USER=$(git config user.name || echo "")
if [ -z "$GIT_USER" ]; then
    read -p "请输入您的 Hugging Face 用户名: " HF_USERNAME
else
    read -p "请输入您的 Hugging Face 用户名 (默认: $GIT_USER): " HF_USERNAME
    HF_USERNAME=${HF_USERNAME:-$GIT_USER}
fi

SPACE_URL="https://huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}"
SPACE_REPO="https://${HF_USERNAME}:${HF_TOKEN}@huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}"

echo -e "${GREEN}目标 Space: ${SPACE_URL}${NC}"

# 检查是否已存在 huggingface remote
if git remote | grep -q "^huggingface$"; then
    echo -e "${YELLOW}已存在 huggingface remote，正在更新...${NC}"
    git remote set-url huggingface "$SPACE_REPO"
else
    echo -e "${YELLOW}添加 huggingface remote...${NC}"
    git remote add huggingface "$SPACE_REPO"
fi

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}当前分支: ${CURRENT_BRANCH}${NC}"

# 确认部署
read -p "确认要推送到 Hugging Face Spaces 吗? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 1
fi

# 推送到 Hugging Face
echo -e "${YELLOW}正在推送代码到 Hugging Face Spaces...${NC}"
if git push huggingface ${CURRENT_BRANCH}:main --force; then
    echo -e "${GREEN}✓ 部署成功！${NC}"
    echo -e "${GREEN}您的 Space 地址: ${SPACE_URL}${NC}"
    echo -e "${YELLOW}注意: Space 可能需要几分钟时间来构建和启动${NC}"
    echo -e "${YELLOW}您可以在以下地址查看构建日志: ${SPACE_URL}${NC}"
else
    echo -e "${RED}✗ 部署失败${NC}"
    echo -e "${YELLOW}如果 Space 不存在，请先在 Hugging Face 创建：${NC}"
    echo -e "1. 访问 https://huggingface.co/new-space"
    echo -e "2. Space name: ${SPACE_NAME}"
    echo -e "3. SDK: Docker"
    echo -e "4. License: MIT"
    exit 1
fi

# 显示后续步骤
echo -e "\n${GREEN}=== 后续步骤 ===${NC}"
echo -e "1. 访问您的 Space: ${SPACE_URL}"
echo -e "2. 等待容器构建完成（查看 Logs 标签页）"
echo -e "3. 使用默认密码 'admin123' 登录管理后台"
echo -e "4. 添加您的 Google 账号 Token"
echo -e "5. 开始使用 API: https://${HF_USERNAME}-${SPACE_NAME}.hf.space/v1/chat/completions"
