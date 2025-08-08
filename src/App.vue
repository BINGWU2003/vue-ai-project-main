<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { NConfigProvider, zhCN, dateZhCN, NMessageProvider, NDialogProvider } from 'naive-ui'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

// 应用启动时初始化用户状态
onMounted(() => {
  userStore.initializeUser()
})
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
        <RouterView />
      </NConfigProvider>
    </n-dialog-provider>
  </n-message-provider>
</template>
