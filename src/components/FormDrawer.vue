<template>
    <el-drawer 
        v-model="showDrawer" 
        :title="title" 
        :size="size" 
        :close-on-click-modal="false" 
        :destroy-on-close="destroyOnClose"
        :before-close="handleClose"
    >
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" class="w-[120px]" size="large" @click="onSubmit" :loading="loading">{{confirmText}}</el-button>
                <el-button type="warning" class="w-[120px]" size="large" @click="close" >取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '40%'
    },
    confirmText: {
        type: String,
        default: '提交'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['submit', 'close'])

const loading = ref(false)

// 显示loading
const showLoading = () => loading.value = true

// 隐藏loading
const hideLoading = () => loading.value = false


const showDrawer = ref(false)

// 打开
const open = () => showDrawer.value = true

// 关闭
const close = () => {
    showDrawer.value = false
    emit('close')
}
// 原生打叉点击调用
const handleClose = (done) => {
    emit('close')
    done()
}

function onSubmit() {
    emit('submit')
}

// 向父级暴露一下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})

</script>

<style lang="scss" scoped>
.formDrawer {
    height: 100%;
    width: 100%;
    @apply flex flex-col;
    overflow: hidden;
    .body {
        flex: 1;
        overflow-y: auto;
    }
    .actions {
        margin-top: 30px;
        @apply flex items-center;
    }
}
</style>