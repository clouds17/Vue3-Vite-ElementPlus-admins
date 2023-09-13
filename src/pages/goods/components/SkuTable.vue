<template>
    <el-form-item label="规格设置">
        <table class="border">
            <thead>
                <tr>
                    <th 
                        class="border"
                        v-for="(th, thi) in tableThs" 
                        :key="thi" 
                        :width="th.width"
                        :colspan="th.colspan"
                        :rowspan="th.rowspan"
                    >{{ th.name }}</th>
                </tr>
                <tr>
                    <th class="border" v-for="(th, thi) in skuLables" :key="thi">{{ th.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(skuItem, skuIndex) in sku_list" :key="skuIndex">
                    <td  :width="100" class="border text-center"  v-for="(sku, skuI) in skuItem.skus" :key="skuI"> {{ sku.value }}</td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.pprice"  /></td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.oprice"  /></td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.cprice"  /></td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.stock"  /></td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.volume"  /></td>
                    <td class="border text-center"><input class="w-20" type="number" v-model="skuItem.weight"  /></td>
                    <td class="border text-center"><input class="w-20" type="text" v-model="skuItem.code"  /></td>
                </tr>
            </tbody>
        </table>
        
    </el-form-item>
</template>

<script setup>
import {
    initSkuTable
} from '~/composables/useSku.js';

const {
    skuLables,
    tableThs,
    sku_list
} = initSkuTable()


</script>

<style lang="scss" scoped>

</style>