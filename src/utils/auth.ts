import CryptoJS from 'crypto-js'

// 加密密码
export function encryptPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}

// 验证邮箱格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证手机号格式（中国大陆）
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 验证密码强度（至少8位，包含字母和数字）
export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordRegex.test(password)
}

// 生成随机字符串
export function generateRandomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 存储令牌
export function setToken(token: string): void {
  localStorage.setItem('auth_token', token)
}

// 获取令牌
export function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

// 移除令牌
export function removeToken(): void {
  localStorage.removeItem('auth_token')
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!getToken()
}
