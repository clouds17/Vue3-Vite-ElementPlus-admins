<template>
    <el-drawer title="设置轮播图" v-model="dialogVisible" size="40%" destroy-on-close :show-close="true" >
        <el-form :model="form"  v-loading="isLoading">
            <el-form-item >
                <choose-image v-model="form.banners" :limit = 9></choose-image>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="submitBtnLoading">提交</el-button>
            </el-form-item>
        </el-form>
        
    </el-drawer>
    
</template>

<script setup>
import { reactive, ref } from 'vue';
import ChooseImage from '~/components/ChooseImage.vue'
import { read_goods_api, set_goods_banners } from '~/api/goods.js'
import { toast } from '~/composables/util.js';

const dialogVisible = ref(false)
const isLoading = ref(false)

const form = reactive({
    banners: []
})

const goodsId = ref(0)
const open = (row) => {
    isLoading.value = true
    row.bannersLoading = true
    goodsId.value = row.id
    read_goods_api({
        id: row.id
    }).then(res => {
        form.banners = res.goodsBanner.map(v => v.url)
        dialogVisible.value = true
    }).finally(() => {
        isLoading.value = false
        row.bannersLoading = false
    })
}

const emit = defineEmits(['reloadData'])

const submitBtnLoading = ref(false)
const onSubmit = () => {
    submitBtnLoading.value = true
    set_goods_banners({
        id: goodsId.value,
        banners: form.banners
    }).then(res => {
        toast('设置轮播图成功')
        dialogVisible.value = false
        emit('reloadData')
    }).finally(() => {
        submitBtnLoading.value = false
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>