// 应用配置
export const config = {
  // AI API 配置
  ai: {
    apiKey: 'sk-0504e0a094a042a18832b5a66bd7497f',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-turbo',
    maxTokens: 2000,
    temperature: 0.7,
    timeout: 30000, // 30秒超时
  },

  // 应用配置
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'AI对话平台',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // API 配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },

  // 对话配置
  chat: {
    maxMessages: 50, // 最大消息数量
    maxMessageLength: 2000, // 单条消息最大长度
    systemPrompt: '你是一个友善、专业的AI助手。请用简洁、准确的中文回答用户的问题。',
  }
}

// 检查必要的环境变量
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.ai.apiKey) {
    errors.push('缺少通义千问API密钥，请设置 VITE_TONG_YI_API_KEY 环境变量')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export default config
