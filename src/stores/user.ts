import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService'
import { setToken, removeToken, getToken } from '../utils/auth'
import type { User, LoginForm, RegisterForm } from '../types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  // 清除错误
  function clearError() {
    error.value = null
  }

  // 登录
  async function login(formData: LoginForm): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await loginUser(formData)

      if (response.code === 200 && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        setToken(response.data.token)
        return true
      } else {
        error.value = response.message
        return false
      }
    } catch {
      error.value = '登录失败，请重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  async function register(formData: RegisterForm): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await registerUser(formData)

      if (response.code === 200) {
        // 注册成功后自动登录
        const loginForm: LoginForm = {
          account: formData.email || formData.phone || '',
          password: formData.password,
          type: formData.email ? 'email' : 'phone'
        }
        return await login(loginForm)
      } else {
        error.value = response.message
        return false
      }
    } catch {
      error.value = '注册失败，请重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 获取当前用户信息
  async function fetchCurrentUser(): Promise<void> {
    if (!token.value) return

    isLoading.value = true
    try {
      const response = await getCurrentUser()
      if (response.code === 200 && response.data) {
        user.value = response.data
      } else {
        // Token可能已过期
        await logout()
      }
    } catch (err) {

      console.error('获取用户信息失败:', err)
      await logout()
    } finally {
      isLoading.value = false
    }
  }

  // 退出登录
  async function logout(): Promise<void> {
    isLoading.value = true
    try {
      await logoutUser()
    } catch (err) {

      console.error('退出登录失败:', err)
    } finally {
      user.value = null
      token.value = null
      removeToken()
      isLoading.value = false
    }
  }

  // 初始化用户状态
  async function initializeUser(): Promise<void> {
    if (token.value) {
      await fetchCurrentUser()
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    // 计算属性
    isLoggedIn,
    // 方法
    login,
    register,
    logout,
    fetchCurrentUser,
    initializeUser,
    clearError
  }
})
