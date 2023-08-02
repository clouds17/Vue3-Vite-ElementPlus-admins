<template>
    <div class="flex items-center h-full">
        <div class="flex items-center">
            <img :src="$baseImg + 'my-logo4.png'" alt="" style="height: 40px;">
            <h3 class="pl-3 text-lg text-white font-bold">小黄的商城后台</h3>
        </div>
        <div class="flex items-center">
            <el-icon><Fold /></el-icon>
            <el-icon><Refresh /></el-icon>
        </div>
        <div class="flex items-center">
            <el-icon><FullScreen /></el-icon>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-avatar :size="50" :src="$baseImg + 'avatar.jpg'" />
                    admin
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item disabled>Action 4</el-dropdown-item>
                        <el-dropdown-item divided>Action 5</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ArrowDown, Fold, Refresh, FullScreen } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
}
</style>