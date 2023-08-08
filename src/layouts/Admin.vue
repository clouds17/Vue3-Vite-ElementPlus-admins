<template>
    <el-container>
        <el-header >
            <f-header></f-header>
        </el-header>
        <div class="h-[64px]"></div>
        <el-container>
            <el-aside>
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <f-tag-list></f-tag-list>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from '~/layouts/components/FHeader.vue';
import FMenu from '~/layouts/components/FMenu.vue';
import FTagList from '~/layouts/components/FTagList.vue';

</script>

<style lang="scss" scoped>
.el-container {
    height: 0;
}
.el-aside {
    overflow: hidden
}
.el-header {
    @apply bg-indigo-700;
    height: 64px;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
}
.el-aside {
    max-width: 300px;
    width: auto;
    @apply shadow-md;
}

.el-main {
    @apply bg-light-200;
}
</style>