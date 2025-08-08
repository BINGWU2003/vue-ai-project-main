<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <n-h1>AI 对话平台</n-h1>
        <n-text depth="3">欢迎回来，请登录您的账户</n-text>
      </div>

      <n-form ref="formRef" :model="formData" :rules="rules" size="large" @submit.prevent="handleSubmit">
        <n-form-item path="type" label="登录方式">
          <n-radio-group v-model:value="formData.type">
            <n-space>
              <n-radio value="email">邮箱</n-radio>
              <n-radio value="phone">手机号</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="account" :label="formData.type === 'email' ? '邮箱' : '手机号'">
          <n-input v-model:value="formData.account" :placeholder="formData.type === 'email' ? '请输入邮箱地址' : '请输入手机号'"
            clearable />
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input v-model:value="formData.password" type="password" placeholder="请输入密码" show-password-on="click"
            clearable />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" size="large" :loading="userStore.isLoading" attr-type="submit" block>
            登录
          </n-button>
        </n-form-item>

        <div class="login-footer">
          <n-text depth="3">
            还没有账户？
            <n-button text type="primary" @click="goToRegister">
              立即注册
            </n-button>
          </n-text>
        </div>
      </n-form>

      <!-- 错误提示 -->
      <n-alert v-if="userStore.error" type="error" :title="userStore.error" closable @close="userStore.clearError"
        style="margin-top: 16px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useUserStore } from '../stores/user'
import { validateEmail, validatePhone } from '../utils/auth'
import type { LoginForm } from '../types'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = reactive<LoginForm>({
  account: '',
  password: '',
  type: 'email'
})

// 表单验证规则
const rules: FormRules = {
  account: [
    {
      required: true,
      message: '请输入登录账户',
      trigger: 'blur'
    },
    {
      validator: (rule, value) => {
        if (formData.type === 'email') {
          return validateEmail(value)
        } else {
          return validatePhone(value)
        }
      },
      message: () => formData.type === 'email' ? '请输入有效的邮箱地址' : '请输入有效的手机号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: 'blur'
    }
  ]
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const success = await userStore.login(formData)

    if (success) {
      message.success('登录成功')
      router.push('/chat')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 跳转到注册页面
function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header .n-h1 {
  margin-bottom: 8px;
  color: #333;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
}
</style>
