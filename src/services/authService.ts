import { v4 as uuidv4 } from 'uuid'
import type { LoginForm, RegisterForm, User, ApiResponse } from '../types'

// 模拟用户数据存储
const USERS_STORAGE_KEY = 'ai_chat_users'
const CURRENT_USER_KEY = 'ai_chat_current_user'

// 获取存储的用户列表
function getStoredUsers(): User[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}

// 保存用户到存储
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

// 模拟延迟
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 用户注册
 */
export async function registerUser(formData: RegisterForm): Promise<ApiResponse<User>> {
  await delay(1000) // 模拟网络延迟

  const users = getStoredUsers()

  // 检查用户是否已存在
  const existingUser = users.find(user =>
    (formData.email && user.email === formData.email) ||
    (formData.phone && user.phone === formData.phone)
  )

  if (existingUser) {
    return {
      code: 400,
      message: '用户已存在'
    }
  }

  // 创建新用户
  const newUser: User = {
    id: uuidv4(),
    username: formData.username,
    email: formData.email,
    phone: formData.phone,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveUsers(users)

  return {
    code: 200,
    message: '注册成功',
    data: newUser
  }
}

/**
 * 用户登录
 */
export async function loginUser(formData: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
  await delay(800) // 模拟网络延迟

  const users = getStoredUsers()

  // 查找用户
  const user = users.find(u =>
    (formData.type === 'email' && u.email === formData.account) ||
    (formData.type === 'phone' && u.phone === formData.account)
  )

  if (!user) {
    return {
      code: 404,
      message: '用户不存在'
    }
  }

  // 这里简化密码验证（实际项目中需要验证加密后的密码）
  const token = `token_${user.id}_${Date.now()}`

  // 保存当前用户信息
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

  return {
    code: 200,
    message: '登录成功',
    data: {
      user,
      token
    }
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  await delay(300)

  const currentUser = localStorage.getItem(CURRENT_USER_KEY)

  if (!currentUser) {
    return {
      code: 401,
      message: '未登录'
    }
  }

  return {
    code: 200,
    message: '获取成功',
    data: JSON.parse(currentUser)
  }
}

/**
 * 用户退出登录
 */
export async function logoutUser(): Promise<ApiResponse> {
  await delay(200)

  localStorage.removeItem(CURRENT_USER_KEY)

  return {
    code: 200,
    message: '退出成功'
  }
}
