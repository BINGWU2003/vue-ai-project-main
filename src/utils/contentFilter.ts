// 敏感词列表（基础版本）
const SENSITIVE_WORDS = [
  '敏感词1', '敏感词2', '政治敏感', '暴力', '色情', '赌博', '毒品',
  '自杀', '恐怖主义', '仇恨言论', '诈骗', '非法', '违法'
]

// 替换字符
const REPLACEMENT_CHAR = '*'

/**
 * 检查文本是否包含敏感词
 * @param text 要检查的文本
 * @returns 是否包含敏感词
 */
export function containsSensitiveWords(text: string): boolean {
  const lowerText = text.toLowerCase()
  return SENSITIVE_WORDS.some(word => lowerText.includes(word.toLowerCase()))
}

/**
 * 过滤敏感词，用星号替换
 * @param text 要过滤的文本
 * @returns 过滤后的文本
 */
export function filterSensitiveWords(text: string): string {
  let filteredText = text

  SENSITIVE_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filteredText = filteredText.replace(regex, REPLACEMENT_CHAR.repeat(word.length))
  })

  return filteredText
}

/**
 * 获取文本中的敏感词列表
 * @param text 要检查的文本
 * @returns 包含的敏感词数组
 */
export function getSensitiveWords(text: string): string[] {
  const lowerText = text.toLowerCase()
  return SENSITIVE_WORDS.filter(word => lowerText.includes(word.toLowerCase()))
}

/**
 * 验证消息内容是否合规
 * @param content 消息内容
 * @returns 验证结果
 */
export function validateMessageContent(content: string): {
  isValid: boolean
  filteredContent: string
  sensitiveWords: string[]
} {
  const sensitiveWords = getSensitiveWords(content)
  const isValid = sensitiveWords.length === 0
  const filteredContent = filterSensitiveWords(content)

  return {
    isValid,
    filteredContent,
    sensitiveWords
  }
}
