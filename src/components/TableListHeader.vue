<template>
    <!-- 新增|刷新 -->
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
            <el-button v-if="btns.includes('create')" type="primary" size="default" @click="$emit('create')">新增</el-button>
            <el-popconfirm 
                v-if="btns.includes('delete')"
                :title="'是否批量删除选中' + title + '?'" 
                width="180" 
                confirm-button-text="删除" 
                cancel-button-text="取消" 
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button
                        size="default"
                        type="danger"
                    >批量删除</el-button>
                </template>
            </el-popconfirm>
            <slot></slot>
        </div>
        <el-tooltip
            v-if="btns.includes('refresh')"
            content="刷新数据" placement="top" effect="dark">
            <el-button type="text" @click="$emit('refresh')">
                <el-icon :size="18"><Refresh /></el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    layout: {
        type: String,
        default: 'create, refresh'
    },
    title: {
        type: String,
        default: '规格'
    }
})

const btns = computed(() => props.layout.replace(/\s+/g, '').split(','))

defineEmits(['create', 'refresh', 'delete'])
</script>


<style lang="scss" scoped>

</style>
