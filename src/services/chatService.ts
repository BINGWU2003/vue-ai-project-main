import { v4 as uuidv4 } from 'uuid'
import { validateMessageContent } from '../utils/contentFilter'
import { generateAIResponse } from './aiService'
import type { Message, Conversation, ApiResponse } from '../types'

// 模拟对话数据存储
const CONVERSATIONS_STORAGE_KEY = 'ai_chat_conversations'

// 获取存储的对话列表
function getStoredConversations(): Conversation[] {
  const conversations = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
  return conversations ? JSON.parse(conversations) : []
}

// 保存对话到存储
function saveConversations(conversations: Conversation[]): void {
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations))
}

// 模拟延迟
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 生成对话标题
function generateConversationTitle(content: string): string {
  // 移除多余的空白字符
  const cleanContent = content.trim().replace(/\s+/g, ' ')

  // 如果内容太长，截取前20个字符并添加省略号
  if (cleanContent.length > 20) {
    return cleanContent.substring(0, 20) + '...'
  }

  return cleanContent || '新对话'
}

/**
 * 获取用户的所有对话
 */
export async function getUserConversations(): Promise<ApiResponse<Conversation[]>> {
  await delay(500)

  const conversations = getStoredConversations()

  return {
    code: 200,
    message: '获取成功',
    data: conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
}

/**
 * 创建新对话
 */
export async function createConversation(title?: string): Promise<ApiResponse<Conversation>> {
  await delay(300)

  const now = new Date().toISOString()
  const newConversation: Conversation = {
    id: uuidv4(),
    title: title || '新对话',
    createdAt: now,
    updatedAt: now,
    messages: []
  }

  const conversations = getStoredConversations()
  conversations.push(newConversation)
  saveConversations(conversations)

  return {
    code: 200,
    message: '创建成功',
    data: newConversation
  }
}

/**
 * 发送消息并获取AI回复
 */
export async function sendMessage(conversationId: string, content: string): Promise<ApiResponse<{ userMessage: Message; aiMessage: Message }>> {
  await delay(200)

  // 内容审核
  const validation = validateMessageContent(content)
  if (!validation.isValid) {
    return {
      code: 400,
      message: `消息包含敏感词：${validation.sensitiveWords.join(', ')}`
    }
  }

  const conversations = getStoredConversations()
  const conversationIndex = conversations.findIndex(c => c.id === conversationId)

  if (conversationIndex === -1) {
    return {
      code: 404,
      message: '对话不存在'
    }
  }

  const now = new Date().toISOString()

  // 创建用户消息
  const userMessage: Message = {
    id: uuidv4(),
    content: validation.filteredContent,
    type: 'user',
    timestamp: now,
    conversationId
  }

  try {
    // 调用真实的AI API
    const aiResponse = await generateAIResponse(
      conversations[conversationIndex].messages,
      validation.filteredContent
    )

    // 检查API调用是否出错
    if (aiResponse.error) {
      return {
        code: 500,
        message: `AI服务错误: ${aiResponse.error}`
      }
    }

    // 创建AI回复消息
    const aiMessage: Message = {
      id: uuidv4(),
      content: aiResponse.content,
      type: 'ai',
      timestamp: new Date().toISOString(),
      conversationId
    }

    // 更新对话
    conversations[conversationIndex].messages.push(userMessage, aiMessage)
    conversations[conversationIndex].updatedAt = aiMessage.timestamp

    // 如果是第一条消息，更新对话标题
    if (conversations[conversationIndex].messages.length === 2) {
      conversations[conversationIndex].title = generateConversationTitle(validation.filteredContent)
    }

    saveConversations(conversations)

    return {
      code: 200,
      message: '发送成功',
      data: {
        userMessage,
        aiMessage
      }
    }

  } catch (error: unknown) {
    console.error('发送消息失败:', error)

    return {
      code: 500,
      message: `发送失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

/**
 * 获取特定对话的详情
 */
export async function getConversationById(conversationId: string): Promise<ApiResponse<Conversation>> {
  await delay(200)

  const conversations = getStoredConversations()
  const conversation = conversations.find(c => c.id === conversationId)

  if (!conversation) {
    return {
      code: 404,
      message: '对话不存在'
    }
  }

  return {
    code: 200,
    message: '获取成功',
    data: conversation
  }
}

/**
 * 删除对话
 */
export async function deleteConversation(conversationId: string): Promise<ApiResponse> {
  await delay(300)

  const conversations = getStoredConversations()
  const filteredConversations = conversations.filter(c => c.id !== conversationId)

  if (filteredConversations.length === conversations.length) {
    return {
      code: 404,
      message: '对话不存在'
    }
  }

  saveConversations(filteredConversations)

  return {
    code: 200,
    message: '删除成功'
  }
}
