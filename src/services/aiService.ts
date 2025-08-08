import OpenAI from 'openai'
import { config, validateConfig } from '../config'
import type { Message } from '../types'

// 创建OpenAI客户端实例
const openai = new OpenAI({
  apiKey: config.ai.apiKey,
  baseURL: config.ai.baseURL,
  dangerouslyAllowBrowser: true, // 允许在浏览器中使用
})

// AI响应结果类型
export interface AIResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: string
}

/**
 * 构建对话上下文
 * @param messages 历史消息列表
 * @param maxMessages 最大消息数量
 * @returns OpenAI格式的消息数组
 */
function buildChatContext(messages: Message[], maxMessages: number = 10): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  // 系统提示词
  const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
    role: 'system',
    content: config.chat.systemPrompt
  }

  // 获取最近的消息（保留上下文）
  const recentMessages = messages.slice(-maxMessages)

  // 转换为OpenAI格式
  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = recentMessages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }))

  return [systemMessage, ...chatMessages]
}

/**
 * 调用通义千问API生成回复
 * @param messages 对话历史
 * @param userMessage 用户新消息
 * @returns AI回复结果
 */
export async function generateAIResponse(messages: Message[], userMessage: string): Promise<AIResponse> {
  // 验证配置
  const configValidation = validateConfig()
  if (!configValidation.isValid) {
    return {
      content: '',
      error: `配置错误: ${configValidation.errors.join(', ')}`
    }
  }

  try {
    // 构建对话上下文
    const chatMessages = buildChatContext(messages)

    // 添加用户新消息
    chatMessages.push({
      role: 'user',
      content: userMessage
    })

    // 调用AI API
    const completion = await openai.chat.completions.create({
      model: config.ai.model,
      messages: chatMessages,
      max_tokens: config.ai.maxTokens,
      temperature: config.ai.temperature,
      stream: false, // 不使用流式响应
    })

    const aiMessage = completion.choices[0]?.message?.content

    if (!aiMessage) {
      return {
        content: '',
        error: 'AI服务返回空响应'
      }
    }

    return {
      content: aiMessage.trim(),
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      } : undefined
    }

  } catch (error: unknown) {
    console.error('AI API调用失败:', error)

    let errorMessage = '生成回复失败'

    // 处理不同类型的错误
    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = error.error as { message?: string }
      if (apiError?.message) {
        errorMessage = apiError.message
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    // 常见错误的用户友好提示
    if (errorMessage.includes('API key')) {
      errorMessage = 'API密钥配置错误，请检查设置'
    } else if (errorMessage.includes('quota')) {
      errorMessage = 'API配额不足，请稍后重试'
    } else if (errorMessage.includes('rate limit')) {
      errorMessage = '请求频率过高，请稍后重试'
    } else if (errorMessage.includes('timeout')) {
      errorMessage = '请求超时，请重试'
    }

    return {
      content: '',
      error: errorMessage
    }
  }
}

/**
 * 流式生成AI回复（为未来扩展预留）
 * @param messages 对话历史
 * @param userMessage 用户新消息
 * @param onChunk 接收到新内容块的回调
 * @returns Promise<AIResponse>
 */
export async function generateAIResponseStream(
  messages: Message[],
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<AIResponse> {
  const configValidation = validateConfig()
  if (!configValidation.isValid) {
    return {
      content: '',
      error: `配置错误: ${configValidation.errors.join(', ')}`
    }
  }

  try {
    const chatMessages = buildChatContext(messages)
    chatMessages.push({
      role: 'user',
      content: userMessage
    })

    const stream = await openai.chat.completions.create({
      model: config.ai.model,
      messages: chatMessages,
      max_tokens: config.ai.maxTokens,
      temperature: config.ai.temperature,
      stream: true,
    })

    let fullContent = ''

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullContent += content
        onChunk(content)
      }
    }

    return {
      content: fullContent.trim()
    }

  } catch (error: unknown) {
    console.error('AI流式API调用失败:', error)
    return {
      content: '',
      error: error instanceof Error ? error.message : '生成回复失败'
    }
  }
}

/**
 * 检查AI服务状态
 * @returns 服务是否可用
 */
export async function checkAIServiceHealth(): Promise<{ isHealthy: boolean; error?: string }> {
  try {
    const testResponse = await generateAIResponse([], '测试')
    return {
      isHealthy: !testResponse.error,
      error: testResponse.error
    }
  } catch (error: unknown) {
    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : '服务不可用'
    }
  }
}
