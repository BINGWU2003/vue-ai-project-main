// 用户相关类型
export interface User {
  id: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  createdAt: string
}

// 消息相关类型
export interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: string
  conversationId: string
  isGenerating?: boolean
}

// 对话会话类型
export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

// 登录表单类型
export interface LoginForm {
  account: string // 邮箱或手机号
  password: string
  type: 'email' | 'phone'
}

// 注册表单类型
export interface RegisterForm {
  username: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
  type: 'email' | 'phone'
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 聊天状态类型
export interface ChatState {
  currentConversation: Conversation | null
  conversations: Conversation[]
  isLoading: boolean
  isGenerating: boolean
}

// 用户状态类型
export interface UserState {
  user: User | null
  isLoggedIn: boolean
  token: string | null
}
