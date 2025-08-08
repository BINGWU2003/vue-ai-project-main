# AI 对话平台 - 第一阶段 MVP

基于 Vue 3 + TypeScript + Naive UI 构建的AI对话平台，实现了第一阶段的核心功能。

## 🎯 项目特性

### ✅ 已实现功能（第一阶段 MVP）

- **用户管理系统**
  - 支持邮箱和手机号注册登录
  - 用户状态管理（Pinia）
  - 路由权限控制

- **核心对话功能**
  - 多轮对话支持
  - 实时AI响应（模拟）
  - 对话历史记录
  - 新建/删除对话

- **内容安全**
  - 基础敏感词过滤
  - 用户输入验证

- **用户界面**
  - 现代化聊天界面
  - 完全响应式设计
  - 移动端适配
  - 暗色/亮色主题支持

- **技术架构**
  - Vue 3 Composition API
  - TypeScript 全栈类型安全
  - Pinia 状态管理
  - 模块化服务层设计

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件库**: Naive UI
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **构建工具**: Vite
- **样式**: CSS3 + 响应式设计
- **工具库**: dayjs, axios, crypto-js, uuid

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0 || >= 22.12.0
- pnpm

### 安装依赖

```bash
pnpm install
```

### API配置（重要）

1. **获取通义千问API密钥**
   - 访问 [阿里云灵积平台](https://dashscope.aliyuncs.com/)
   - 注册/登录阿里云账号并开通DashScope服务
   - 创建API密钥

2. **配置环境变量**

   ```bash
   # 在项目根目录创建 .env 文件
   VITE_TONG_YI_API_KEY=your_actual_api_key_here
   ```

   > 📖 详细配置指南请查看 [API_SETUP.md](./API_SETUP.md)

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📖 使用指南

### 1. 用户注册/登录

- 访问 `/login` 进行登录
- 访问 `/register` 进行注册
- 支持邮箱或手机号两种方式

### 2. 开始对话

- 登录后自动跳转到聊天界面
- 点击"新建对话"开始新的AI对话
- 在输入框中输入消息并发送

### 3. 管理对话

- 左侧边栏显示所有历史对话
- 点击对话可切换到该对话
- 鼠标悬停可删除不需要的对话

## 🏗️ 项目结构

```
src/
├── components/          # 公共组件
├── views/              # 页面组件
│   ├── LoginView.vue   # 登录页面
│   ├── RegisterView.vue # 注册页面
│   └── ChatView.vue    # 聊天主界面
├── stores/             # Pinia 状态管理
│   ├── user.ts         # 用户状态
│   └── chat.ts         # 聊天状态
├── services/           # 服务层
│   ├── api.ts          # API 基础配置
│   ├── authService.ts  # 认证服务
│   └── chatService.ts  # 聊天服务
├── utils/              # 工具函数
│   ├── auth.ts         # 认证工具
│   └── contentFilter.ts # 内容过滤
├── types/              # TypeScript 类型定义
└── router/             # 路由配置
```

## 🔧 开发说明

### 数据存储

目前使用 `localStorage` 模拟后端数据存储：

- 用户信息存储在 `ai_chat_users`
- 对话历史存储在 `ai_chat_conversations`
- 当前用户存储在 `ai_chat_current_user`

### AI 服务

已集成阿里云通义千问API：

1. ✅ 支持真实的AI对话生成
2. ✅ 自动上下文管理
3. ✅ 完善的错误处理机制
4. ✅ API状态监控
5. ✅ 多模型支持（qwen-turbo/qwen-plus/qwen-max）

### 安全特性

- 客户端敏感词过滤
- 表单验证和输入清理
- JWT token 模拟（实际部署需要后端实现）

## 🎨 界面展示

- **登录页面**: 简洁的认证界面，支持邮箱/手机号登录
- **聊天界面**: 类似现代IM的对话体验
- **响应式设计**: 完美适配桌面端和移动端

## 📋 下一步计划（第二阶段）

- [x] 集成真实AI API（通义千问）
- [ ] 实现后端服务
- [ ] 添加文件上传功能
- [ ] 实现语音输入
- [ ] 流式响应优化
- [ ] 添加对话搜索功能
- [ ] 实现用户设置页面

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 `LICENSE` 文件

## 🔗 相关链接

- [Vue 3 文档](https://cn.vuejs.org/)
- [Naive UI 文档](https://www.naiveui.com/zh-CN/os-theme)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [TypeScript 文档](https://www.typescriptlang.org/)
