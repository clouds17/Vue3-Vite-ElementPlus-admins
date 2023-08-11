<template>
    <div class="main-container">
        <el-container class="bg-white rounded">
            <el-header>
                <el-button type="primary" @click="openDrawer">新增图片分类</el-button>
                <el-button type="warning">上传图片</el-button>
            </el-header>
            <el-container>
                <image-aside ref="imageAsideRef"></image-aside>
                <image-main></image-main>
            </el-container>
        </el-container>

        
    </div>
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/image/ImageAside.vue";
import ImageMain from "~/components/image/ImageMain.vue";

const imageAsideRef = ref(null)
const openDrawer = () => {
    imageAsideRef.value.openDrawer()
}

</script>

<style lang="scss" scoped>
.el-container {
    overflow: hidden;
    height: 0;

    .el-header {
        @apply flex items-center;
        border-bottom: 1px solid #eee;
        .el-tag:hover {
            cursor: pointer;
        }
    }

}
</style>