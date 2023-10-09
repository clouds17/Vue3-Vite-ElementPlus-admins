<template>
    <div v-loading="isLoading" class="bg-white p-4 rounded">
        <el-form :model="BaseForm" ref="BaseFormRef"  label-width="160px" >
            <el-form-item label="物流查询Key" >
                <el-input v-model="BaseForm.ship" style="max-width: 300px;"></el-input>
                <span class="text-sm pt-2 text-gray-400 w-full">用于查询物流信息，接口申请（仅供参考）</span>
            </el-form-item>
            <el-form-item  class="mt-3">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { get_sysconfig_api, set_sysconfig_api } from '~/api/sysconfig.js'
import { toast } from '~/composables/util.js';

const isLoading = ref(false)

const BaseForm = reactive({
    "ship": "..."
})



function getData() {
    isLoading.value = true
    get_sysconfig_api().then(res => {
        for (let key in BaseForm) {
            BaseForm[key] = res[key]
        }
    }).finally(() => {
        isLoading.value = false
    })
}

getData()


const onSubmit = () => {
    isLoading.value = true
    set_sysconfig_api(BaseForm).then(res => {
        toast('修改成功')
    }).finally(() => {
        isLoading.value = false
    })
}
</script> 

<style lang="scss" scoped>

</style>