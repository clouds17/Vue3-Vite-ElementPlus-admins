<template>
    <div v-loading="isLoading" class="bg-white p-4 rounded flex-1 overflow-y-auto">
        <el-form :model="BaseForm" ref="BaseFormRef"  label-width="160px" >
            <h5 class="bg-gray-100 p-3 mb-5 rounded">基础设置</h5>
            <el-form-item label="分销启用" >
                <el-radio-group v-model="BaseForm.distribution_open" >
                    <el-radio :label="0" border>
                        禁用
                    </el-radio>
                    <el-radio :label="1" border>
                        启用
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分销海报设置" >
                <choose-image v-model="BaseForm.spread_banners" :limit = 9></choose-image>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 mb-5 rounded">返佣设置</h5>
            <el-form-item label="一级返佣比例" >
                <el-input v-model="BaseForm.store_first_rebate" placeholder="一级返佣比例" type="number"  style="width: 50%;">
                    <template #apeend>%</template>
                </el-input>
                <p class="text-sm text-gray-400 w-full mt-2">订单交易成功后给上级返佣的比例0 - 100， 例：5 = 反订单金额的5%</p>
            </el-form-item>
            <el-form-item label="二级返佣比例" >
                <el-input v-model="BaseForm.store_second_rebate" placeholder="二级返佣比例" type="number"  style="width: 50%;">
                    <template #apeend>%</template>
                </el-input>
                <p class="text-sm text-gray-400 w-full mt-2">订单交易成功后给上级返佣的比例0 - 100， 例：5 = 反订单金额的5%</p>
            </el-form-item>
            <el-form-item label="自购返佣" >
                <el-radio-group v-model="BaseForm.is_self_brokerage" >
                    <el-radio :label="1" border>
                        是
                    </el-radio>
                    <el-radio :label="0" border>
                        否
                    </el-radio>
                </el-radio-group>
                <p class="text-sm text-gray-400 w-full mt-2">是否开启自购返佣(开启:分销元自己购买商品，上级享受二级返佣；关闭：分销员自己购买商品没有返佣)</p>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 mb-5 rounded">结算设置</h5>
            <el-form-item label="结算时间" >
                <el-input v-model="BaseForm.settlement_days" placeholder="结算时间" type="number"  style="width: 50%;">
                    <template #prepend>订单完成后</template>
                    <template #append>天</template>
                </el-input>
                <p class="text-sm text-gray-400 w-full mt-2">预估佣金结算后无法进行回收，请谨慎设置结算天数</p>
            </el-form-item>
            <el-form-item label="佣金到账方式" >
                <el-radio-group v-model="BaseForm.brokerage_method" >
                    <el-radio label="hand" border>
                        手动转账
                    </el-radio>
                    <el-radio label="wx" border>
                        自动到微信零钱
                    </el-radio>
                </el-radio-group>
                <p class="text-sm text-gray-400 w-full mt-2">佣金到账方式支持线下转账和微信零钱自动转账，手动转账更加安全，自动转账更方便</p>
            </el-form-item>
           
            <el-form-item  class="mt-5">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
        
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import ChooseImage from '~/components/ChooseImage.vue'
import { get_distribution_setting, set_distribution_setting } from '~/api/distribution.js'
import { toast } from '~/composables/util.js';

const isLoading = ref(false)

const BaseForm = reactive({
    // 分销启用:0禁用1启用
    "distribution_open": 0, 
    // 一级返佣比例：0~100
    "store_first_rebate":10, 
    // 二级返佣比例：0~100
    "store_second_rebate":20,
    // 分销海报图
    "spread_banners":[
        "http://...png",
    ],
    // 自购返佣:0否1是
    "is_self_brokerage":1,
    // 结算时间（单位：天）
    "settlement_days":7,
    // 佣金到账方式:hand手动,wx微信
    "brokerage_method":"hand"
})





function getData() {
    isLoading.value = true
    get_distribution_setting().then(res => {
        // Object.assign(BaseForm, res)
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
    set_distribution_setting(BaseForm).then(res => {
        toast('修改成功')
    }).finally(() => {
        isLoading.value = false
    })
}
</script>

<style lang="scss" scoped>

</style>