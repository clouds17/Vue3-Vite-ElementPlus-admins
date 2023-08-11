<template>
    <div class="aside-list" :class="{ active }">
        <span class="truncate"><slot /></span>
        <el-button 
            class="ml-auto px-1" 
            text type="primary" 
            size="small"
            @click="$emit('edit')"
        >
            <el-icon :size="13"><Edit/></el-icon>
        </el-button>
        <el-popconfirm title="是否删除此分类?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="$emit('delete')">
            <template #reference>
                <el-button 
                    class="px-1" 
                    text type="primary" 
                    size="small"
                >
                    <el-icon :size="13"><Close/></el-icon>
                </el-button>
            </template>
        </el-popconfirm>
        
    </div>
</template>

<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

defineEmits(["edit", "delete"])

</script>

<style lang="scss" scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover, .active {
    @apply bg-blue-50;
}
.el-button+.el-button {
    margin-left: 8px;
}
</style>