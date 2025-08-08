# 通义千问API配置指南

## 🚀 快速开始

### 1. 获取API密钥

1. 访问 [阿里云灵积平台](https://dashscope.aliyuncs.com/)
2. 注册/登录阿里云账号
3. 开通DashScope服务
4. 在控制台创建API密钥

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# AI API 配置
VITE_TONG_YI_API_KEY=your_actual_api_key_here

# 可选配置
VITE_AI_MODEL=qwen-turbo
VITE_APP_TITLE=AI对话平台
```

### 3. 重启开发服务器

```bash
pnpm dev
```

## 📋 API配置说明

### 支持的模型

- `qwen-turbo` - 通义千问超大规模语言模型（默认）
- `qwen-plus` - 通义千问增强版
- `qwen-max` - 通义千问旗舰版

### 配置参数

| 参数                   | 说明            | 默认值       |
| ---------------------- | --------------- | ------------ |
| `VITE_TONG_YI_API_KEY` | API密钥（必需） | -            |
| `VITE_AI_MODEL`        | 使用的模型      | `qwen-turbo` |
| `VITE_APP_TITLE`       | 应用标题        | `AI对话平台` |

## 🔧 高级配置

### 修改模型参数

编辑 `src/config/index.ts`：

```typescript
export const config = {
  ai: {
    maxTokens: 2000, // 最大生成token数
    temperature: 0.7, // 创造性参数 (0-1)
    timeout: 30000, // 请求超时时间(毫秒)
  },
}
```

### 自定义系统提示词

```typescript
export const config = {
  chat: {
    systemPrompt: '你是一个专业的AI助手...',
  },
}
```

## 🚨 常见问题

### 1. API密钥无效

- 检查密钥是否正确复制
- 确认DashScope服务已开通
- 验证账户余额是否充足

### 2. 请求超时

- 检查网络连接
- 尝试增加超时时间配置
- 确认服务器状态

### 3. 配额限制

- 查看API调用量配额
- 升级服务套餐
- 优化请求频率

## 📖 API文档

- [通义千问API文档](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
- [OpenAI兼容接口](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope)

## 🔒 安全注意事项

1. **不要将API密钥提交到版本控制**
   - `.env` 文件已在 `.gitignore` 中
   - 使用环境变量而非硬编码

2. **生产环境配置**
   - 使用服务器端代理避免密钥暴露
   - 设置适当的请求限制

3. **密钥管理**
   - 定期轮换API密钥
   - 监控API使用情况
