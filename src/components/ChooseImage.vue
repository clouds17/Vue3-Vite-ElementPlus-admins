<template>
    <div class="choose-image-btn" @click="open">
        <el-icon class="text-gray-500"><Plus /></el-icon>
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
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit">OK</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/image/ImageAside.vue";
import ImageMain from "~/components/image/ImageMain.vue";


const dialogVisible = ref(false)

const open = () => dialogVisible.value = true

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

// 选中了图片
const imageChoose = (item) => {
    console.log('选择', item)
}

const submit = () => {
    console.log('提交')
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