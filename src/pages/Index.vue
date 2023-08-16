<template>
    <div class="main-container">
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panelsData.length == 0">
                <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex items-center justify-between text-sm">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <!-- card body -->
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-divider />
                                <div class="flex items-center justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" :offset="0" v-for="(item, index) in panelsData" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex items-center justify-between text-sm">
                            <span>{{item.title}}</span>
                            <el-tag  size="default" effect="plain" :type="item.unitColor" >{{ item.unit }}</el-tag>
                        </div>
                    </template>
                    <!-- card body -->
                    <span class="text-3xl font-bold text-gray-600">
                        <count-to :value="item.value"></count-to>
                    </span>
                    <el-divider />
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>{{item.subTitle}}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
                
            </el-col>
        </el-row>
        
        <index-navs></index-navs>
        
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0" v-permission="['getStatistics3,GET']">
                <index-chart></index-chart>
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <index-card title="店铺及商品提示" tip="店铺及商品提示" :resData="goodsData"></index-card>
                <index-card class=" mt-4" title="交易提示" tip="需要立即处理的订单" :resData="orderData"></index-card>
            </el-col>
        </el-row>
        

    </div>
</template>

<script setup>
import { ref } from "vue";
import { get_statistics1, get_statistics2} from '~/api/home.js';
import CountTo from '~/components/CountTo.vue'
import IndexNavs from "~/components/index/IndexNavs.vue";
import IndexChart from "~/components/index/IndexChart.vue";
import IndexCard from "~/components/index/IndexCard.vue";


const panelsData = ref([])
const goodsData = ref([])
const orderData = ref([])

// 后台首页统计1
get_statistics1()
    .then(res => {
        panelsData.value = res.panels
    })
    
// 后台首页统计2
get_statistics2()
    .then(res => {
        goodsData.value = res.goods
        orderData.value = res.order
    })



</script>

<style lang="scss" scoped>

</style>