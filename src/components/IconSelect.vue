<template>
    <div class="flex items-center">
        <el-icon class="mr-2" :size="20" v-if="modelValue">
            <component :is="modelValue"></component>
        </el-icon>
        <el-select :modelValue="modelValue" placeholder="请选择图标" clearable filterable @change="handleChange">
            <el-option v-for="item in icons"
                :key="item"
                :label="item"
                :value="item">
                    <div class="flex items-center justify-between overflow-hidden w-full">
                        <el-icon class="flex-shrink-0">
                            <component :is="item"></component>
                        </el-icon>
                        <span class="text-gray-500 text-xs">
                            {{ item }}
                        </span>
                    </div>
            </el-option>
        </el-select>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as iconList from '@element-plus/icons-vue'


const icons = ref(Object.keys(iconList))

defineProps({
    modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const handleChange = (icon) => {
    emit('update:modelValue', icon)
}

</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
    @apply flex items-center;
}
</style>