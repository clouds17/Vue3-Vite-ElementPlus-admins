<template>
    <div class=" f-header-container">
        <div class="logo">
            <img :src="$baseImg + 'my-logo4.png'" alt="" class="h-[30px]">
            <h3 class="pl-3 text-white">小黄的商城后台</h3>
        </div>
        <div class="flex items-center">
            <el-icon class="icon-btn"><Fold /></el-icon>
            <el-icon class="icon-btn"><Refresh /></el-icon>
        </div>
        <div class="flex items-center ml-auto">
            <el-icon class="icon-btn"><FullScreen /></el-icon>
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
                        <el-dropdown-item command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ArrowDown, Fold, Refresh, FullScreen } from '@element-plus/icons-vue'

function handleCommand(command) {
    console.log(command)
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