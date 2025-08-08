<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <n-h1>创建账户</n-h1>
        <n-text depth="3">加入AI对话平台，开始智能对话体验</n-text>
      </div>

      <n-form ref="formRef" :model="formData" :rules="rules" size="large" @submit.prevent="handleSubmit">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="formData.username" placeholder="请输入用户名" clearable />
        </n-form-item>

        <n-form-item path="type" label="注册方式">
          <n-radio-group v-model:value="formData.type">
            <n-space>
              <n-radio value="email">邮箱</n-radio>
              <n-radio value="phone">手机号</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item v-if="formData.type === 'email'" path="email" label="邮箱">
          <n-input v-model:value="formData.email" placeholder="请输入邮箱地址" clearable />
        </n-form-item>

        <n-form-item v-if="formData.type === 'phone'" path="phone" label="手机号">
          <n-input v-model:value="formData.phone" placeholder="请输入手机号" clearable />
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input v-model:value="formData.password" type="password" placeholder="至少8位，包含字母和数字" show-password-on="click"
            clearable />
        </n-form-item>

        <n-form-item path="confirmPassword" label="确认密码">
          <n-input v-model:value="formData.confirmPassword" type="password" placeholder="请再次输入密码"
            show-password-on="click" clearable />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" size="large" :loading="userStore.isLoading" attr-type="submit" block>
            注册
          </n-button>
        </n-form-item>

        <div class="register-footer">
          <n-text depth="3">
            已有账户？
            <n-button text type="primary" @click="goToLogin">
              立即登录
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
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useUserStore } from '../stores/user'
import { validateEmail, validatePhone, validatePassword } from '../utils/auth'
import type { RegisterForm } from '../types'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = reactive<RegisterForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  type: 'email'
})

// 监听注册方式变化，清空对应字段
watch(() => formData.type, (newType) => {
  if (newType === 'email') {
    formData.phone = ''
  } else {
    formData.email = ''
  }
})

// 表单验证规则
const rules = computed<FormRules>(() => ({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 20,
      message: '用户名长度应在2-20字符之间',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: formData.type === 'email',
      message: '请输入邮箱地址',
      trigger: 'blur'
    },
    {
      validator: (rule, value) => {
        if (formData.type === 'email' && value) {
          return validateEmail(value)
        }
        return true
      },
      message: '请输入有效的邮箱地址',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: formData.type === 'phone',
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      validator: (rule, value) => {
        if (formData.type === 'phone' && value) {
          return validatePhone(value)
        }
        return true
      },
      message: '请输入有效的手机号',
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
      validator: (rule, value) => validatePassword(value),
      message: '密码至少8位，需包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur'
    },
    {
      validator: (rule, value) => value === formData.password,
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ]
}))

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const success = await userStore.register(formData)

    if (success) {
      message.success('注册成功，正在跳转...')
      router.push('/chat')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 跳转到登录页面
function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 440px;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header .n-h1 {
  margin-bottom: 8px;
  color: #333;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
}

@media (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
  }
}
</style>
