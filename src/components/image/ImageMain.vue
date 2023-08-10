<template>
    <el-main>
        <div class="content">
            <p v-for="i in 100" :key="i">{{ i }}</p>
        </div>
        <div class="paging">分页</div>
    </el-main>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.el-main {
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