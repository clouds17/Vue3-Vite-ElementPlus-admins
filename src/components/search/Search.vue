<template>
    <!-- 搜索 -->
    <el-form :model="model" > 
        <el-row :gutter="20">
            <slot />
            <template v-if="showSearch">
                <slot name="show" />
            </template>
            <el-col :span="8" :offset="showSearch ? 0 : 8 ">
                <el-form-item class="text-right">
                    <el-button  type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button v-if="isShowReset" @click="$emit('reset')">重置</el-button>
                    <el-button type="primary"  text @click="showSearch = !showSearch" v-if="hasShowSearch">
                        {{ showSearch ? '收起' : '展开' }}
                        <el-icon  class="pl-1">
                            <ArrowUp v-if="showSearch" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                    
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';

defineProps({
    model: Object,
    isShowReset: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['search', 'reset'])

// 查看父组件引用有没有使用插槽
const slots = useSlots()
const hasShowSearch = ref(!!slots.show)
console.log('slots', slots)


// 显示隐藏搜索
const showSearch = ref(false)

</script>

<style lang="scss" scoped>

</style>