<template>
    <div>
        <el-form-item label="规格选项" class="skuCard" v-loading="isLoading">
            <el-card 
                shadow="never" 
                class="w-full mb-3" 
                v-for="(item, index) in sku_card_list"
                :key="item.id"
                v-loading="item.isLoading"
            >
                <template #header>
                    <div class="flex items-center">
                        <el-input v-model="item.text" placeholder="规格名称" style="max-width: 300px;" @change="updateSkuCardEvent(item)">
                            <template #append>
                                <el-icon class="cursor-pointer" @click="handleChooseSku(item)"><more/></el-icon>
                            </template>
                        </el-input>
                        <el-button 
                            text size="small" 
                            class="ml-auto" 
                            :disabled="index == 0"
                            @click="sortCard('up', index)"
                        ><el-icon><top/></el-icon></el-button>
                        <el-button 
                            text 
                            size="small"
                            :disabled="index == sku_card_list.length - 1" 
                            @click="sortCard('dowm', index)"
                        ><el-icon><bottom/></el-icon></el-button>
                        <el-popconfirm  title="是否删除该选项?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="deleteSkuCardEvent(item)">
                            <template #reference>
                                <el-button text size="small" ><el-icon><delete/></el-icon></el-button>
                            </template>
                        </el-popconfirm>
                        
                    </div>
                </template>
                <!-- card body -->
                <sku-card-item :id="item.id"></sku-card-item>
            </el-card>
            <el-button type="success" :loading="btnLoading" @click="addSkuCardEvent" >添加规格</el-button>

            
            
            <choose-sku ref="ChooseSkuRef"></choose-sku>

        </el-form-item>
        <sku-table></sku-table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SkuCardItem from './SkuCardItem.vue';
import ChooseSku from '~/components/ChooseSku.vue';
import SkuTable from './SkuTable.vue';

import {
    sku_card_list,
    btnLoading,
    addSkuCardEvent,
    updateSkuCardEvent,
    deleteSkuCardEvent,
    sortCard,
    isLoading,
    handleChooseSetGoodsSkuCard
} from '~/composables/useSku.js'


const ChooseSkuRef = ref(null)
const handleChooseSku = (item) => {
    ChooseSkuRef.value.open((options) => {
        handleChooseSetGoodsSkuCard(item, options)
    })
}

</script>

<style lang="scss" scoped>
.skuCard {
    :deep(.el-card__header) {
        @apply p-2 bg-gray-50;
    }
}

</style>