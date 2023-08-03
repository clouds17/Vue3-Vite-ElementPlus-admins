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
</template>

<script setup>
import { ArrowDown, Fold, Refresh, FullScreen, Aim } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { MessageBox, toast } from '~/composables/util.js'
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
const store = useStore()
const router = useRouter()


// 刷新
const handleRefresh = () => location.reload()

// 下拉选择点击函数
function handleCommand(command) {
    switch (command) {
        case 'rePassword':
            console.log(command)
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