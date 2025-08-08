<template>
  <div class="chat-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-mobile-hidden': !showSidebar }">
      <div class="sidebar-header">
        <n-button type="primary" size="large" block @click="createNewChat" :loading="chatStore.isLoading">
          <template #icon>
            <n-icon>
              <PlusIcon />
            </n-icon>
          </template>
          新建对话
        </n-button>
      </div>

      <div class="sidebar-content">
        <n-scrollbar style="height: calc(100vh - 180px);">
          <div class="conversation-list">
            <div v-for="conversation in chatStore.conversations" :key="conversation.id" class="conversation-item"
              :class="{ 'active': chatStore.currentConversation?.id === conversation.id }"
              @click="selectConversation(conversation.id)">
              <div class="conversation-title">{{ conversation.title }}</div>
              <div class="conversation-time">{{ formatTime(conversation.updatedAt) }}</div>
              <n-button quaternary circle size="small" class="conversation-delete"
                @click.stop="deleteConversation(conversation.id)">
                <template #icon>
                  <n-icon>
                    <DeleteIcon />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </n-scrollbar>
      </div>

      <div class="sidebar-footer">
        <div class="user-info">
          <n-avatar size="small" :src="userStore.user?.avatar">
            {{ userStore.user?.username?.[0] }}
          </n-avatar>
          <span class="username">{{ userStore.user?.username }}</span>
          <n-button quaternary circle size="small" @click="handleLogout">
            <template #icon>
              <n-icon>
                <LogoutIcon />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="chat-main">
      <!-- 移动端头部 -->
      <div class="mobile-header">
        <n-button quaternary circle @click="toggleSidebar">
          <template #icon>
            <n-icon>
              <MenuIcon />
            </n-icon>
          </template>
        </n-button>
        <span class="chat-title">
          {{ chatStore.currentConversation?.title || 'AI 对话助手' }}
        </span>
      </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <n-scrollbar ref="scrollbar" style="height: 100%">
          <div class="messages-list">
            <!-- API状态提示 -->
            <ApiStatus v-if="!chatStore.currentMessages.length" />
            <!-- 欢迎消息 -->
            <div v-if="!chatStore.currentMessages.length" class="welcome-message">
              <div class="welcome-content">
                <n-icon size="48" color="#666">
                  <ChatIcon />
                </n-icon>
                <n-h3>欢迎使用 AI 对话助手</n-h3>
                <n-text depth="3">
                  开始一段有趣的对话吧！我可以帮助您解答问题、提供建议或者只是聊天。
                </n-text>
              </div>
            </div>

            <!-- 消息列表 -->
            <div v-for="message in chatStore.currentMessages" :key="message.id" class="message-item"
              :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }">
              <div class="message-avatar">
                <n-avatar v-if="message.type === 'user'" size="medium" :src="userStore.user?.avatar">
                  {{ userStore.user?.username?.[0] }}
                </n-avatar>
                <n-avatar v-else size="medium" color="#6366f1">
                  <n-icon>
                    <BotIcon />
                  </n-icon>
                </n-avatar>
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>

            <!-- AI 思考中指示器 -->
            <div v-if="chatStore.isGenerating" class="message-item ai-message">
              <div class="message-avatar">
                <n-avatar size="medium" color="#6366f1">
                  <n-icon>
                    <BotIcon />
                  </n-icon>
                </n-avatar>
              </div>
              <div class="message-content">
                <div class="thinking-indicator">
                  <n-spin size="small" />
                  <span style="margin-left: 8px;">AI 正在思考...</span>
                </div>
              </div>
            </div>
          </div>
        </n-scrollbar>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <n-input v-model:value="inputMessage" type="textarea" placeholder="输入您的消息..."
            :autosize="{ minRows: 1, maxRows: 4 }" :disabled="chatStore.isGenerating" @keydown="handleKeyDown" />
          <n-button type="primary" :disabled="!inputMessage.trim() || chatStore.isGenerating"
            :loading="chatStore.isGenerating" @click="sendMessage">
            <template #icon>
              <n-icon>
                <SendIcon />
              </n-icon>
            </template>
            发送
          </n-button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <n-message-provider>
      <!-- 消息提示会自动显示 -->
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import { useUserStore } from '../stores/user'
import { useChatStore } from '../stores/chat'
import ApiStatus from '../components/ApiStatus.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 图标组件（这里使用简单的文本替代，实际项目中可以使用图标库）
const PlusIcon = { render: () => '+' }
const DeleteIcon = { render: () => '×' }
const LogoutIcon = { render: () => '↗' }
const MenuIcon = { render: () => '☰' }
const ChatIcon = { render: () => '💬' }
const BotIcon = { render: () => '🤖' }
const SendIcon = { render: () => '→' }

// 初始化dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const route = useRoute()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()
const chatStore = useChatStore()

// 响应式数据
const inputMessage = ref('')
const showSidebar = ref(true)
const messagesContainer = ref<HTMLElement>()
const scrollbar = ref()

// 格式化时间
function formatTime(timestamp: string): string {
  return dayjs(timestamp).fromNow()
}

// 切换侧边栏显示
function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

// 创建新对话
async function createNewChat() {
  const conversation = await chatStore.createNewConversation()
  if (conversation) {
    router.push(`/chat/${conversation.id}`)
  }
}

// 选择对话
async function selectConversation(conversationId: string) {
  await chatStore.selectConversation(conversationId)
  router.push(`/chat/${conversationId}`)
  // 移动端自动隐藏侧边栏
  if (window.innerWidth <= 768) {
    showSidebar.value = false
  }
}

// 删除对话
async function deleteConversation(conversationId: string) {
  dialog.warning({
    title: '确认删除',
    content: '确定要删除这个对话吗？此操作不可撤销。',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      const success = await chatStore.removeConversation(conversationId)
      if (success) {
        message.success('对话已删除')
        // 如果删除的是当前对话，跳转到聊天首页
        if (route.params.id === conversationId) {
          router.push('/chat')
        }
      } else {
        message.error(chatStore.error || '删除失败')
      }
    }
  })
}

// 发送消息
async function sendMessage() {
  const content = inputMessage.value.trim()
  if (!content) return

  // 如果没有当前对话，先创建一个
  if (!chatStore.currentConversation) {
    const conversation = await chatStore.createNewConversation()
    if (!conversation) {
      message.error('创建对话失败')
      return
    }
  }

  const success = await chatStore.sendUserMessage(content)
  if (success) {
    inputMessage.value = ''
    // 滚动到底部
    scrollToBottom()
  } else {
    message.error(chatStore.error || '发送失败')
  }
}

// 键盘事件处理
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (scrollbar.value) {
      scrollbar.value.scrollTo({ top: scrollbar.value.$el.scrollHeight })
    }
  })
}

// 退出登录
async function handleLogout() {
  dialog.warning({
    title: '确认退出',
    content: '确定要退出登录吗？',
    positiveText: '退出',
    negativeText: '取消',
    onPositiveClick: async () => {
      await userStore.logout()
      router.push('/login')
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.currentMessages.length, () => {
  scrollToBottom()
})

// 监听窗口大小变化
function handleResize() {
  if (window.innerWidth > 768) {
    showSidebar.value = true
  }
}

// 组件挂载时初始化
onMounted(async () => {
  // 初始化用户状态
  await userStore.initializeUser()

  // 获取对话列表
  await chatStore.fetchConversations()

  // 如果有路由参数中的对话ID，加载对应对话
  if (route.params.id) {
    await chatStore.selectConversation(route.params.id as string)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  handleResize()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-content {
  flex: 1;
  overflow: hidden;
}

.conversation-list {
  padding: 8px;
}

.conversation-item {
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #f0f0f0;
}

.conversation-item.active {
  background-color: #e6f7ff;
  border: 1px solid #1890ff;
}

.conversation-title {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: 12px;
  color: #999;
}

.conversation-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.conversation-item:hover .conversation-delete {
  opacity: 1;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  flex: 1;
  font-weight: 500;
}

/* 主聊天区域样式 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-header {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.chat-title {
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  background: white;
  overflow: hidden;
}

.messages-list {
  padding: 16px;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}

.welcome-content {
  text-align: center;
  max-width: 400px;
}

.welcome-content .n-h3 {
  margin: 16px 0 8px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  min-width: 0;
}

.user-message .message-content {
  text-align: right;
}

.message-text {
  background: #f0f0f0;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.user-message .message-text {
  background: #1890ff;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.thinking-indicator {
  display: flex;
  align-items: center;
  color: #999;
  padding: 12px 16px;
  background: #f0f0f0;
  border-radius: 12px;
}

/* 输入区域样式 */
.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container .n-input {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .sidebar-mobile-hidden {
    transform: translateX(-100%);
  }

  .chat-main {
    width: 100%;
  }

  .mobile-header {
    display: flex;
  }

  .message-content {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100vw;
  }

  .input-container {
    flex-direction: column;
    gap: 8px;
  }

  .input-container .n-button {
    align-self: stretch;
  }
}
</style>
