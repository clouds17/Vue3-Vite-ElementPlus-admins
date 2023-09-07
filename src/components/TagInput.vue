<template>
    <div>
        <template v-if="dynamicTags.length > 0">
            <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
            >
                {{ tag }}
            </el-tag>
        </template>
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
            + 添加值
        </el-button>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
    modelValue: String
})

const emit = defineEmits(['update:modelValue'])
// 添加规格值

const dynamicTags = computed({
    get() {
        return props.modelValue.length > 0 ? props.modelValue.split(',') : []
    },
    set(newValue) {
        console.log('newValue', newValue)
        // formData.default = newValue.join(',')
        emit('update:modelValue', newValue.join(','))
    }
})

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)

const handleClose = (tag) => {
    let tempArr = dynamicTags.value
    tempArr.splice(tempArr.indexOf(tag), 1)
    dynamicTags.value = tempArr
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    let tempArr = dynamicTags.value
    tempArr.push(inputValue.value)
    dynamicTags.value = tempArr
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style lang="scss" scoped>

</style>