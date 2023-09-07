<template>
    <el-drawer
        v-model="drawer"
        :title="title"
        :destroy-on-close="true"
    >
        <el-upload
            class="upload-demo"
            :action="upload_image"
            drag
            multiple
            :headers="{
                token
            }"
            name="img"
            :data="data"
            :on-success="upload_success"
            :on-error="upload_error"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                点击或拖拽上传图片
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    支持jpg/png 文件且图片小于500KB
                </div>
            </template>
        </el-upload>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue"
import { upload_image } from '~/api/image.js'
import { toast } from '~/composables/util.js'
import { getToken } from '~/composables/auth.js'


const props = defineProps({
    title: {
        type: String,
        default: '图片上传'
    },
    data: {
        type: Object,
        default: () => {
            return {
                image_class_id: 0
            }
        }
    }  
})

const token = getToken()

const drawer = ref(false)
const open = () => drawer.value = true
const close = () => drawer.value = false

const emit = defineEmits(['success'])

const upload_success = (response, uploadFile, uploadFiles) => {
    console.log('e', response)
    emit('success', {
        response, uploadFile, uploadFiles
    })
}

const upload_error = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg
    toast(msg, 'error')
}

// 向父级暴露一下方法
defineExpose({
    open,
    close
})
</script>

<style lang="scss" scoped>

</style>