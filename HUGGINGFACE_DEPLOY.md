# Hugging Face Spaces 部署指南

本项目已配置为可直接部署到 Hugging Face Spaces。

## 部署步骤

### 1. 准备 Hugging Face 账号和 Token

- 访问 [Hugging Face](https://huggingface.co/)
- 登录或注册账号
- 在 [Settings > Access Tokens](https://huggingface.co/settings/tokens) 创建一个 **Write** 权限的 Token
- 您的 Token: `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`

### 2. 快速部署（推荐）

使用提供的部署脚本一键部署到 Hugging Face Spaces：

```bash
# 给脚本添加执行权限
chmod +x deploy_to_huggingface.sh

# 运行部署脚本
./deploy_to_huggingface.sh <SPACE_NAME> <HF_TOKEN>

# 示例
./deploy_to_huggingface.sh antigravity-gateway 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
```

脚本会自动完成以下操作：
1. 配置 Hugging Face 远程仓库
2. 推送代码到 Space
3. 显示部署后的访问地址

> **注意**: 首次使用需要先在 Hugging Face 创建 Space（见方法一）

### 3. 手动部署方式

#### 方法一：通过 Web 界面创建

1. 访问 [Hugging Face Spaces](https://huggingface.co/spaces)
2. 点击 "Create new Space"
3. 填写信息：
   - **Space name**: 选择一个名称（如 `antigravity-gateway`）
   - **License**: MIT
   - **Select the Space SDK**: 选择 **Docker**
   - **Space hardware**: 选择免费的 CPU basic
4. 点击 "Create Space"

#### 方法二：通过 Git 推送

```bash
# 1. 添加 Hugging Face 作为 remote
git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME

# 2. 配置 Git 凭证（使用您的 Token）
git config credential.helper store
# 当提示输入密码时，输入您的 Token: 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

# 3. 推送代码
git push huggingface main
```

### 3. 配置 Space 环境变量（可选）

在 Space 的 Settings 中可以设置环境变量：

- `PORT`: 默认 7860（Hugging Face 自动设置）
- `HOST`: 默认 0.0.0.0（Dockerfile 中已设置）

### 4. 添加 Google 账号 Token

部署后，您需要在 Space 中添加 Google 账号的 Access Token：

1. Space 启动后，访问管理后台（默认地址会是 `https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME`）
2. 使用默认密码 `admin123` 登录
3. 在 Token 管理页面添加您的 Google 账号凭证

> **注意**: 由于 Hugging Face Spaces 的容器是临时的，每次重启后需要重新配置账号。建议使用环境变量或 Secrets 功能来持久化敏感配置。

### 5. 使用 Hugging Face CLI 部署（可选）

```bash
# 安装 Hugging Face CLI
pip install huggingface_hub

# 登录
huggingface-cli login
# 输入您的 Token: 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

# 创建并上传到 Space
huggingface-cli repo create SPACE_NAME --type space --space_sdk docker

# 克隆 Space 仓库
git clone https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME
cd SPACE_NAME

# 复制项目文件到 Space 目录
cp -r /path/to/Antigravity2api/* .

# 提交并推送
git add .
git commit -m "Initial deployment"
git push
```

## 文件说明

本次部署添加了以下文件：

1. **Dockerfile**: Docker 容器配置文件，用于构建应用镜像
2. **.dockerignore**: 指定 Docker 构建时忽略的文件
3. **README.md**: 添加了 Hugging Face Spaces 所需的 YAML 前置元数据
4. **src/config/config.js**: 更新以支持 PORT 和 HOST 环境变量

## 访问部署的应用

部署成功后，您可以通过以下地址访问：

- **Space URL**: `https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME`
- **API 端点**: `https://YOUR_USERNAME-SPACE_NAME.hf.space/v1/chat/completions`

## 故障排除

### Space 构建失败

1. 检查 Dockerfile 语法
2. 查看 Space 的 Logs 标签页了解详细错误信息
3. 确保所有依赖项都在 package.json 中正确声明

### 应用无法启动

1. 检查 Space 是否正在运行（Running 状态）
2. 查看 Logs 了解启动错误
3. 确认端口配置正确（Hugging Face 使用 7860）

### 无法访问 API

1. 确认 API Key 配置正确
2. 检查请求格式是否符合 OpenAI 格式
3. 查看应用日志排查问题

## 限制和注意事项

1. **临时存储**: Hugging Face Spaces 的文件系统是临时的，重启后会丢失数据
2. **资源限制**: 免费 Space 有 CPU 和内存限制
3. **休眠策略**: 长时间无访问会自动休眠
4. **公开可见**: 默认情况下 Space 是公开的，注意不要暴露敏感信息

## 相关链接

- [Hugging Face Spaces 文档](https://huggingface.co/docs/hub/spaces)
- [Docker Spaces 指南](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [原项目](https://github.com/liuw1535/antigravity2api-nodejs)
