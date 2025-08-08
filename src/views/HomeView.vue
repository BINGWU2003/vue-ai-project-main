<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const goToAbout = () => {
  loading.value = true
  setTimeout(() => {
    router.push('/about')
    loading.value = false
  }, 1000)
}
</script>

<template>
  <main>
    <n-space vertical size="large" align="center" style="padding: 60px 20px;">
      <n-h1>欢迎使用 Vue + Naive UI</n-h1>

      <n-text depth="3" style="font-size: 18px;">
        这是一个集成了 Naive UI 组件库的 Vue 3 项目
      </n-text>

      <n-space size="large">
        <n-button type="primary" size="large" :loading="loading" @click="goToAbout">
          查看组件示例
        </n-button>

        <n-button size="large" tag="a" href="https://www.naiveui.com/zh-CN/os-theme" target="_blank">
          访问官方文档
        </n-button>
      </n-space>

      <n-divider />

      <n-grid :cols="3" :x-gap="20">
        <n-grid-item>
          <n-card title="🎨 丰富组件" embedded>
            <n-text>
              提供了 80+ 个高质量组件，覆盖了大部分业务场景
            </n-text>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="🌙 主题定制" embedded>
            <n-text>
              支持亮色和暗色主题，可以轻松定制主题色彩
            </n-text>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="📱 响应式" embedded>
            <n-text>
              所有组件都支持响应式设计，适配各种屏幕尺寸
            </n-text>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-space>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.n-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
</style>
