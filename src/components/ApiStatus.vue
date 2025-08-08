<template>
  <div class="api-status">
    <n-alert v-if="!isConfigured" type="warning" title="API配置提醒" :show-icon="false" closable>
      <div>
        <p>请配置通义千问API密钥以启用AI功能：</p>
        <ol style="margin: 8px 0; padding-left: 20px;">
          <li>在项目根目录创建 <code>.env</code> 文件</li>
          <li>添加配置：<code>VITE_TONG_YI_API_KEY=your_api_key_here</code></li>
          <li>重启开发服务器</li>
        </ol>
        <p>
          <n-button text type="primary" tag="a"
            href="https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key"
            target="_blank">
            获取API密钥 →
          </n-button>
        </p>
      </div>
    </n-alert>

    <n-alert v-else-if="healthStatus === 'error'" type="error" title="AI服务异常" :show-icon="false">
      <div>
        <p>{{ healthError }}</p>
        <n-button size="small" @click="checkHealth">
          重试检查
        </n-button>
      </div>
    </n-alert>

    <n-alert v-else-if="healthStatus === 'healthy'" type="success" title="AI服务正常" :show-icon="false" closable>
      通义千问API连接正常，可以开始对话
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { config } from '../config'
import { checkAIServiceHealth } from '../services/aiService'

const healthStatus = ref<'checking' | 'healthy' | 'error' | 'unconfigured'>('checking')
const healthError = ref<string>('')
const isConfigured = ref(!!config.ai.apiKey)

async function checkHealth() {
  if (!isConfigured.value) {
    healthStatus.value = 'unconfigured'
    return
  }

  healthStatus.value = 'checking'

  try {
    const result = await checkAIServiceHealth()
    if (result.isHealthy) {
      healthStatus.value = 'healthy'
    } else {
      healthStatus.value = 'error'
      healthError.value = result.error || '服务检查失败'
    }
  } catch (error: unknown) {
    healthStatus.value = 'error'
    healthError.value = error instanceof Error ? error.message : '网络连接失败'
  }
}

onMounted(() => {
  checkHealth()
})
</script>

<style scoped>
.api-status {
  margin-bottom: 16px;
}

code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
}
</style>
