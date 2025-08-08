<template>
  <div class="about">
    <n-space vertical size="large">
      <n-h1>Naive UI 示例页面</n-h1>

      <n-card title="按钮示例" embedded>
        <n-space>
          <n-button type="primary">主要按钮</n-button>
          <n-button type="info">信息按钮</n-button>
          <n-button type="success">成功按钮</n-button>
          <n-button type="warning">警告按钮</n-button>
          <n-button type="error">错误按钮</n-button>
        </n-space>
      </n-card>

      <n-card title="输入框示例" embedded>
        <n-space vertical>
          <n-input v-model:value="inputValue" placeholder="请输入内容" />
          <n-input-number v-model:value="numberValue" placeholder="请输入数字" />
          <n-select v-model:value="selectValue" :options="selectOptions" placeholder="请选择" />
        </n-space>
      </n-card>

      <n-card title="消息提示" embedded>
        <n-space>
          <n-button @click="showMessage('info')">信息消息</n-button>
          <n-button @click="showMessage('success')">成功消息</n-button>
          <n-button @click="showMessage('warning')">警告消息</n-button>
          <n-button @click="showMessage('error')">错误消息</n-button>
        </n-space>
      </n-card>

      <n-card title="数据表格" embedded>
        <n-data-table :columns="columns" :data="tableData" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

// 表单数据
const inputValue = ref('')
const numberValue = ref(null)
const selectValue = ref(null)
const selectOptions = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
]

// 消息提示
const showMessage = (type: 'info' | 'success' | 'warning' | 'error') => {
  message[type](`这是一个${type}消息`)
}

// 表格数据
const columns = [
  { title: 'ID', key: 'id' },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '城市', key: 'city' }
]

const tableData = [
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' },
  { id: 3, name: '王五', age: 28, city: '广州' }
]
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
