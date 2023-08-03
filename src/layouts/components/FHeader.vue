<template>
    <div class=" f-header-container">
        <div class="logo">
            <img :src="$baseImg + 'my-logo4.png'" alt="" class="h-[30px]">
            <h3 class="pl-3 text-white">小黄的商城后台</h3>
        </div>
        <div class="flex items-center">
            <el-icon class="icon-btn"><Fold /></el-icon>
            <el-tooltip
                effect="dark"
                content="刷新"
                placement="bottom"
            >
                <el-icon @click="handleRefresh" class="icon-btn"><Refresh /></el-icon>
            </el-tooltip>
        </div>
        <div class="flex items-center ml-auto">
            <el-tooltip
                effect="dark"
                :content="isFullscreen ? '取消全屏' : '全屏'"
                placement="bottom"
            >
                <el-icon @click="toggle" class="icon-btn">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="px-7" @command="handleCommand">
                <span class="el-dropdown-link">
                    <el-avatar :size="40" :src="$store.state.user.user.avatar" />
                    <span class="pl-3">{{ $store.state.user.user.username }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <el-drawer v-model="showDrawer" title="修改密码" :size="s_drawer" :close-on-click-modal="false">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="large" class="flex flex-col min-h-full">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" size="large" show-password placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input v-model="form.password" size="large" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="form.repassword" size="large" show-password placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <el-form-item class="mt-auto" style="margin-left: -60px;">
                <el-button type="primary" class="w-[120px]" @click="onSubmit" :loading="loading">提交</el-button>
                <el-button type="warning" class="w-[120px]" @click="showDrawer = false">关闭</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ArrowDown, Fold, Refresh, FullScreen, Aim } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { MessageBox, toast } from '~/composables/util.js'
import { useFullscreen } from '@vueuse/core'
import { ref, reactive } from 'vue'

const { isFullscreen, toggle } = useFullscreen()
const store = useStore()
const router = useRouter()
let showDrawer = ref(false)

const win_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let s_drawer = 0

if (win_width > 1280) {
    s_drawer = 500
} else if (win_width > 1024) {
    s_drawer = 400
} else if (win_width > 414) {
    s_drawer = 300
} else {
    s_drawer = 250
}

// 修改密码
let loading = ref(false)
const form = reactive({
    oldpassword: '', 
    password: '',
    repassword: ''
})
const checkPass = (rule, value, callback) => {
    const reg =  /^(?=.*\d).{5,16}$/
    if (!reg.test(value)) {
        return callback(new Error("密码至少包含一个数字"))
    }
    callback()
}
const checkRePass = (rule, value, callback) => {
    if (value !== form.password) {
        return callback(new Error("密码不一致"))
    }
    callback()
}
const rules = {
    oldpassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
        { validator: checkPass, trigger: 'blur' }
    ],
    repassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
        { validator: checkRePass, trigger: 'blur' }
    ]
}

const formRef = ref(null)
// 提交密码
function onSubmit() {
    formRef.value.validate((valid) => {
        if (!valid) return false;
        loading.value = true
        store.dispatch('UpdatePassword', form)
            .then(res => {
                showDrawer.value = false
                toast('密码修改成功,请重新登录')

                return store.dispatch('Logout')
            })
            .then(res => {
                router.push('/login')
            })
            .finally(() => {
                loading.value = false
            })
    })
}

// 刷新
const handleRefresh = () => location.reload()

// 下拉选择点击函数
function handleCommand(command) {
    switch (command) {
        case 'rePassword':
            showDrawer.value = true
            break;
        case 'logout':
            handleLogout()
            break;
        default:
            break;
    }
}


// 退出登录
function handleLogout() {
    MessageBox('是否要退出登录?')
        .then(res => {
            store.dispatch('Logout')
                .then(res => {
                    router.push('/login')
                    toast('退出登录成功')
                })
        })
}

</script>

<style lang="scss" scoped>

.f-header-container {
    @apply flex items-center h-full text-light-50;

    .logo {
        padding: 0 20px;
        box-sizing: border-box;
        min-width: 300px;
        @apply flex items-center justify-center text-xl font-thin;
    }

    .icon-btn {
        @apply flex items-center justify-center;
        width: 42px;
        height: 64px;
        cursor: pointer;
        &:hover {
            @apply bg-indigo-600;
        } 
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #fff;
        display: flex;
        align-items: center;
       
    }
}

</style>