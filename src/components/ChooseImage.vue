<template>
    <div class="flex items-center">
        <el-image v-if="modelValue" :src="modelValue" fit="cover" :lazy="true" class="border w-[100px] h-[100px] rounded mr-3"></el-image>
        <div class="choose-image-btn" @click="open">
            <el-icon class="text-gray-500"><Plus /></el-icon>
        </div>
    </div>
    <el-dialog
        title="选择图片"
        v-model="dialogVisible"
        width="80%"
        top="5vh"
        
    >
        <el-container class="bg-white rounded">
            <el-header>
                <el-button type="primary" @click="openDrawer">新增图片分类</el-button>
                <el-button type="warning" @click="uploadFile">上传图片</el-button>
            </el-header>
            <el-container>
                <image-aside ref="imageAsideRef" @change="aside_completed"></image-aside>
                <image-main ref="imageMainRef" showChecked @choose="imageChoose"></image-main>
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/image/ImageAside.vue";
import ImageMain from "~/components/image/ImageMain.vue";




const imageAsideRef = ref(null)
const openDrawer = () => {
    imageAsideRef.value.openDrawer()
}

// 分类加载完成
const imageMainRef = ref(null)
const aside_completed = (id) => {
    imageMainRef.value.loadData(id)
}
const uploadFile = () => {
    imageMainRef.value.openUpladFile()
}

// dialog框打开和关闭
const dialogVisible = ref(false)

const open = () => dialogVisible.value = true
const close = () => {
    dialogVisible.value = false
    imageMainRef.value.clearChooseBox()
}

// 选中了图片
let urls = []
const imageChoose = (item) => {
    urls = item.map(v => v.url)
    console.log('选择', item)
}

defineProps({
    modelValue: [String, Array]
})
const emit = defineEmits(['update:modelValue'])

const submit = () => {
    console.log('提交')
    if (urls.length) {
        emit('update:modelValue', urls[0])
    }
    close()
}



</script>

<style lang="scss" scoped>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border bg-light-100 flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}


.el-container {
    overflow: hidden;
    height: 70vh;

    .el-header {
        @apply flex items-center;
        border-bottom: 1px solid #eee;
        .el-tag:hover {
            cursor: pointer;
        }
    }

}
</style>