<template>
    <el-aside width="220px" >
        <div class="content">
            <aside-list>分类标题</aside-list>
            <aside-list :active="true">分类标题</aside-list>
        </div>
        <div class="paging">分页</div>
    </el-aside>
</template>

<script setup>
import AsideList from "./AsideList.vue";

</script>

<style lang="scss" scoped>
    .el-aside {
        padding-top: 20px;
        height: 100%;
        padding-bottom: 0px !important;
        @apply flex flex-col;
        .content {
            flex: 1;
            overflow: auto;
        }
        .paging {
            height: 50px;
            @apply flex items-center justify-center;
        }
    }
</style>