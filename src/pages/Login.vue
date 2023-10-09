<template>
  <div>
    <el-row class="min-h-screen">
      <el-col :lg="16" :md="12"  class="left-box">
        <div>
          <h3>
            欢迎光临
          </h3>
          <p >
            此站点为小黄的Vue3 + ElementPlus 实战商城后台项目
          </p>
          <h5 class=" text-white mt-2 text-md">
            账号: admin  密码: admin
          </h5>
        </div>
      </el-col>
      <el-col :lg="8" :md="12"  class="right-box">
        <h3>欢迎回来</h3>
        <div class="sub-title">
            <span class="line"></span>
            <span>账号密码登录</span>
            <span class="line"></span>
        </div>
        <el-form :rules="rules" ref="formRef" :model="form" class="w-[250px]">
          <el-form-item prop="username">
            <el-input size="large" v-model="form.username" placeholder="请输入用户名" >
                <template #prefix>
                    <el-icon><User /></el-icon>
                </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" show-password size="large" v-model="form.password" placeholder="请输入密码" >
                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="w-[250px]" round color="#626aef" size="large"
                type="primary" @click="onSubmit" :loading="loading">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { toast } from '~/composables/util.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useStore()

const loading = ref(false)

const form = reactive({
    username: '',
    password: ''
})

const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
}

const formRef = ref(null)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return false;
        // 设置loading
        loading.value = true

        store.dispatch('Login', form)
            .then(res => {
                toast('登录成功')

                // 跳转到首页
                router.replace('/')
            })
            .finally(() => {
                // 设置loading
                loading.value = false
            })

    })
}
// 监听回车函数
function onKeyUp(e) {
    if (e.key === "Enter") {
        onSubmit()
    }
}

onMounted(() => {
    // 添加键盘监听事件
    document.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
    // 移除键盘监听事件
    document.removeEventListener('keyup', onKeyUp)
})


</script>

<style lang="scss" scoped>
    .sub-title,
    .right-box,
    .left-box {
        @apply flex items-center justify-center;
    }

    .left-box {
        @apply bg-indigo-500;

        h3 {
            @apply text-5xl font-bold text-light-50 leading-normal mb-4;
        }
        p {
            @apply text-gray-200 text-base;
        }
    }
    .right-box {
        @apply bg-light-50  flex-col;

        h3 {
            @apply font-bold text-3xl text-gray-800;
        }

        .sub-title {
            @apply my-7 text-gray-300 space-x-4;

            .line {
                @apply h-[1px] w-10 bg-gray-200;
            }
        }
    }
</style>