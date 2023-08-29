<template>
    <!-- 新增|刷新 -->
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
            <el-button type="primary" size="default" @click="$emit('create')">新增</el-button>
            <slot></slot>
        </div>
        <el-tooltip content="刷新数据" placement="top" effect="dark">
            <el-button type="text" @click="$emit('refresh')">
                <el-icon :size="18"><Refresh /></el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script setup>
defineEmits(['create', 'refresh'])
</script>


<style lang="scss" scoped>

</style>
