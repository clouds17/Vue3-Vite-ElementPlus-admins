<template>
    <div v-loading="item.loading">
        <el-tag
            v-for="(tag, index) in item.goodsSkusCardValue" 
            :key="index"
            class="mx-1"
            closable
            effect="plain"
            :disable-transitions="false"
            @close="handleClose(tag)"
        >
            <el-input v-model="tag.text" placeholder="规格值" size="small" class="w-20 ml-[-10px]" @change="handleChange($event, tag)"></el-input>
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + 添加规格值
        </el-button>
    </div>
</template>

<script setup>

import {
    initSkuCardItem
} from '~/composables/useSku.js'

const props = defineProps({
    id: [String, Number]
})
// 初始化当前的规格值
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    handleChange
} = initSkuCardItem(props.id)

console.log('inputVisible', inputVisible.value)

</script>

<style lang="scss" scoped>

</style>