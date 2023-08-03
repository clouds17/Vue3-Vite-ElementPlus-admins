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

    <form-drawer ref="formDrawerRef" @submit="onSubmit" @close="onClose" title="修改密码" destroyOnClose >
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
        </el-form>
    </form-drawer>

</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'
import { useRepassword, useLogout } from '~/composables/useManager.js'
const { isFullscreen, toggle } = useFullscreen()
// 修改密码
const {
    form,
    rules,
    formRef,
    formDrawerRef,
    onSubmit,
    onClose
} = useRepassword()
// 退出登录
const {
    handleLogout
} = useLogout()



// 刷新
const handleRefresh = () => location.reload()

// 下拉选择点击函数
function handleCommand(command) {
    switch (command) {
        case 'rePassword':
            formDrawerRef.value.open()
            break;
        case 'logout':
            handleLogout()
            break;
        default:
            break;
    }
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