# Hugging Face Spaces 快速入门

这是一个 5 分钟快速部署指南，帮助您将 Antigravity Gateway 部署到 Hugging Face Spaces。

## 前提条件

- Hugging Face 账号
- Git 已安装
- 您的 Hugging Face Token: `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`

## 三步部署

### 第 1 步：创建 Space

访问 [https://huggingface.co/new-space](https://huggingface.co/new-space) 并填写：

- **Owner**: 选择您的账号
- **Space name**: `antigravity-gateway` (或任何您喜欢的名称)
- **License**: MIT
- **Select the Space SDK**: **Docker** ⚠️ 重要：必须选择 Docker
- **Space hardware**: CPU basic (免费)

点击 **Create Space**

### 第 2 步：推送代码

在项目根目录执行：

```bash
# 添加 Hugging Face 远程仓库
git remote add huggingface https://YOUR_USERNAME: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@huggingface.co/spaces/YOUR_USERNAME/antigravity-gateway

# 推送代码 (替换 YOUR_USERNAME 为您的用户名)
git push huggingface main
```

**或者使用一键部署脚本：**

```bash
./deploy_to_huggingface.sh antigravity-gateway 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
```

### 第 3 步：等待构建

- 访问您的 Space 页面
- 点击 **Logs** 标签页查看构建进度
- 等待 3-5 分钟，直到显示 "Running" 状态

## 使用您的 Space

### 访问管理后台

1. 打开 Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/antigravity-gateway`
2. 点击页面顶部的 "Open" 或直接访问应用
3. 使用默认密码登录：`admin123`
4. **重要**：登录后立即修改管理密码

### 添加 Google 账号

1. 在本地运行登录脚本获取 Token：
   ```bash
   npm run login
   ```
2. 在管理后台的 "Token 管理" 页面添加获取的 Token
3. 保存后即可开始使用

### 测试 API

```bash
curl https://YOUR_USERNAME-antigravity-gateway.hf.space/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-admin" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

## 常见问题

### Q: Space 构建失败了怎么办？

**A:** 检查 Logs 标签页的错误信息。常见问题：
- 确保选择了 **Docker** SDK（不是 Gradio 或 Streamlit）
- 检查 Token 权限是否为 Write
- 尝试重新推送代码

### Q: 应用无法启动？

**A:** 查看 Logs 确认：
- 容器是否成功构建
- 端口配置是否正确（应该自动使用 7860）
- 是否有依赖安装失败

### Q: 数据会丢失吗？

**A:** 是的。Hugging Face Spaces 使用临时存储，重启后会丢失数据。建议：
- 定期备份账号配置
- 使用环境变量存储关键配置
- 考虑外部数据库（如果需要持久化）

### Q: 免费版有限制吗？

**A:** 免费 CPU basic Space 限制：
- CPU: 2 cores
- RAM: 16 GB
- 存储: 50 GB（临时）
- 长时间无访问会自动休眠

### Q: 如何保护我的 Space？

**A:** 安全建议：
- 立即修改默认管理密码
- 使用强 API Key
- 不要在公开的 Space 中存储敏感数据
- 考虑使用 Private Space（付费功能）

### Q: 如何更新代码？

**A:** 简单推送即可：
```bash
git push huggingface main
```
Space 会自动重新构建和部署。

## 下一步

- 📖 查看 [完整部署指南](./HUGGINGFACE_DEPLOY.md)
- 🔧 配置高级选项（环境变量、Secrets）
- 📊 在管理后台查看使用统计
- 🔐 配置额外的 API Keys
- 🎨 自定义系统提示词

## 需要帮助？

- [Hugging Face Spaces 文档](https://huggingface.co/docs/hub/spaces)
- [项目 Issues](https://github.com/Sakuralaaa/Antigravity2api/issues)
- [原项目](https://github.com/liuw1535/antigravity2api-nodejs)

---

**祝您使用愉快！** 🚀
