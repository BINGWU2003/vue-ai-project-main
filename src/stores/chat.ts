import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getUserConversations,
  createConversation,
  sendMessage,
  getConversationById,
  deleteConversation
} from '../services/chatService'
import type { Conversation } from '../types'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const isLoading = ref(false)
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const hasConversations = computed(() => conversations.value.length > 0)
  const currentMessages = computed(() => currentConversation.value?.messages || [])

  // 清除错误
  function clearError() {
    error.value = null
  }

  // 获取对话列表
  async function fetchConversations(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await getUserConversations()
      if (response.code === 200 && response.data) {
        conversations.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = '获取对话列表失败'
      console.error('获取对话列表失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 创建新对话
  async function createNewConversation(title?: string): Promise<Conversation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await createConversation(title)
      if (response.code === 200 && response.data) {
        conversations.value.unshift(response.data)
        currentConversation.value = response.data
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (err) {
      error.value = '创建对话失败'
      console.error('创建对话失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 选择对话
  async function selectConversation(conversationId: string): Promise<void> {
    if (currentConversation.value?.id === conversationId) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getConversationById(conversationId)
      if (response.code === 200 && response.data) {
        currentConversation.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = '获取对话失败'
      console.error('获取对话失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 发送消息
  async function sendUserMessage(content: string): Promise<boolean> {
    if (!currentConversation.value) {
      error.value = '请先选择或创建对话'
      return false
    }

    isGenerating.value = true
    error.value = null

    try {
      const response = await sendMessage(currentConversation.value.id, content)
      if (response.code === 200 && response.data) {
        // 更新当前对话的消息
        currentConversation.value.messages.push(
          response.data.userMessage,
          response.data.aiMessage
        )
        currentConversation.value.updatedAt = response.data.aiMessage.timestamp

        // 更新对话列表中的对应对话
        const conversationIndex = conversations.value.findIndex(
          c => c.id === currentConversation.value!.id
        )
        if (conversationIndex !== -1) {
          conversations.value[conversationIndex] = { ...currentConversation.value }
          // 将当前对话移到列表顶部
          const [updatedConversation] = conversations.value.splice(conversationIndex, 1)
          conversations.value.unshift(updatedConversation)
        }

        return true
      } else {
        error.value = response.message
        return false
      }
    } catch (err) {
      error.value = '发送消息失败'
      console.error('发送消息失败:', err)
      return false
    } finally {
      isGenerating.value = false
    }
  }

  // 删除对话
  async function removeConversation(conversationId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await deleteConversation(conversationId)
      if (response.code === 200) {
        conversations.value = conversations.value.filter(c => c.id !== conversationId)

        // 如果删除的是当前对话，清空当前对话
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value = null
        }

        return true
      } else {
        error.value = response.message
        return false
      }
    } catch (err) {
      error.value = '删除对话失败'
      console.error('删除对话失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 清空当前对话
  function clearCurrentConversation(): void {
    currentConversation.value = null
  }

  // 重置状态
  function resetState(): void {
    conversations.value = []
    currentConversation.value = null
    isLoading.value = false
    isGenerating.value = false
    error.value = null
  }

  return {
    // 状态
    conversations,
    currentConversation,
    isLoading,
    isGenerating,
    error,
    // 计算属性
    hasConversations,
    currentMessages,
    // 方法
    fetchConversations,
    createNewConversation,
    selectConversation,
    sendUserMessage,
    removeConversation,
    clearCurrentConversation,
    resetState,
    clearError
  }
})
