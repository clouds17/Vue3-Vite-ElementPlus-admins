<template>
    <form-drawer ref="FormDrawerRef" title="设置商品规格" size="60%" destroy-on-close @close="onClose" @submit="onSubmit">
        <el-form :model="formData" ref="formDataRef"  label-width="80px" >
            <el-form-item label="规格类型" >
                <el-radio-group v-model="formData.sku_type">
                    <el-radio :label="0" border>单规格</el-radio>
                    <el-radio :label="1" border>多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="formData.sku_type == 0">
                <el-form-item label="市场价格" >
                    <el-input v-model="formData.sku_value.oprice" style="max-width: 300px;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格" >
                    <el-input v-model="formData.sku_value.pprice" style="max-width: 300px;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格" >
                    <el-input v-model="formData.sku_value.cprice" style="max-width: 300px;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量" >
                    <el-input v-model="formData.sku_value.weight" style="max-width: 300px;">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积" >
                    <el-input v-model="formData.sku_value.volume" style="max-width: 300px;">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-else>
                <sku-card></sku-card>
            </div>
        </el-form>
        
    </form-drawer>
    
</template>

<script setup>
import { reactive, ref } from 'vue';
import { read_goods_api, update_goods_skus } from '~/api/goods.js'
import { toast } from '~/composables/util.js';
import FormDrawer from '~/components/FormDrawer.vue';
import SkuCard from './components/SkuCard.vue';
import {
    goodsId,
    initSkuCardList
} from '~/composables/useSku.js'

const FormDrawerRef = ref(null)

const formData = reactive({
    sku_type: 0,
    sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
    }
})

const open = (row) => {
    row.skusLoading = true
    goodsId.value = row.id
    read_goods_api({
        id: row.id
    }).then(res => {
        formData.sku_type = res.sku_type || 0
        formData.sku_value = res.sku_value || {
            oprice: 0,
            pprice: 0,
            cprice: 0,
            weight: 0,
            volume: 0
        }
        initSkuCardList(res)
        FormDrawerRef.value.open()
    }).finally(() => {
        row.skusLoading = false
    })
}

const emit = defineEmits(['reloadData'])

const onSubmit = () => {
    FormDrawerRef.value.showLoading()
    update_goods_skus({
        id: goodsId.value,
        ...formData
    }).then(res => {
        toast('更新商品规格成功')
        FormDrawerRef.value.close()
        emit('reloadData')
    }).finally(() => {
        FormDrawerRef.value.hideLoading()
    })
}

const onClose = () => {
    Object.assign(formData, {
        content: '',
        banners: []
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>