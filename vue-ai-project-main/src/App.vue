<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, zhCN, dateZhCN, NMessageProvider } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
      <RouterView />
    </NConfigProvider>
  </n-message-provider>
</template>
