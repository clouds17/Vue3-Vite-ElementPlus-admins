<template>
    <div class="main-container">
        <el-container class="bg-white rounded">
            <el-header>Header</el-header>
            <el-container>
                <image-aside></image-aside>
                <image-main></image-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
</script>

<style lang="scss" scoped>
.el-container {
    overflow: hidden;
    height: 0;

    .el-header {
        @apply flex items-center;
        border-bottom: 1px solid #eee;
    }

}
</style>