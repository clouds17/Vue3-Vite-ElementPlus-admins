<template>
    <div>
        <el-button type="primary" @click="num+=1">退出登录</el-button>
        <p>{{ num }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";

let num = ref(0)


</script>

<style lang="scss" scoped>

</style>