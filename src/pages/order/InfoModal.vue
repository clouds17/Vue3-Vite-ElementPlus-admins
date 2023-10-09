<template>
    <el-drawer title="订单详情" v-model="drawerVisible"  size="50%">
        <el-card shadow="never" class="mb-3">
            <template #header>
                <strong class="text-sm">订单详情</strong>
            </template>
            <el-form label-width="90px">
                <el-form-item label="订单号：">
                    {{ info.no }}
                </el-form-item>
                <el-form-item label="付款方式：">
                    {{ paymentMethod(info.payment_method) }}
                </el-form-item>
                <el-form-item label="付款时间：">
                    {{ paymentTime(info.paid_time) }}
                </el-form-item>
                <el-form-item label="创建时间：">
                    {{ info.create_time }}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card shadow="never" class="mb-3" v-if="info.ship_data">
            <template #header>
                <strong class="text-sm">发货信息</strong>
            </template>
            <el-form label-width="90px">
                <el-form-item label="物流公司：">
                    {{ info.ship_data.express_company }}
                </el-form-item>
                <el-form-item label="运单号：">
                    {{ info.ship_data.express_no }}
                    <el-button text class="ml-4" type="primary" @click="openShipInfo(info.id)" :loading="shipInfoLoading">查看物流</el-button>
                </el-form-item>
                <el-form-item label="发货时间：">
                    {{ paymentTime(info.ship_data.express_time) }}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card shadow="never" class="mb-3" v-if="info.order_items">
            <template #header>
                <strong class="text-sm">商品信息</strong>
            </template>
            <div>
                <div v-for="(item, index) in info.order_items" :key="index" class="mb-2">
                    <div class="flex ">
                        <el-image 
                            :src="item.goods_item?.cover ?? ''" 
                            fit="cover" :lazy="true" 
                            style="width: 70px;height:70px;"
                            class="rounded mr-3"
                        ></el-image>
                        <div>
                            <h3 class="text-sm mb-1">{{ item.goods_item?.title ?? '商品已被删除' }}</h3>
                            <el-tag type="info" v-if="item.skus_type == 1 && item.goods_skus" class="mb-1">
                                <!-- <span v-for="(tag, tagI) in item.goods_skus.skus" :key="tagI">
                                    {{ tag.text }}
                                    <span v-if="tagI < Object.keys(item.goods_skus.skus).length - 1">, </span>
                                </span> -->
                                {{ skusTagCon(item.goods_skus.skus) }}
                            </el-tag>
                            <div class="flex text-sm text-gray-400"><span class=" font-bold text-red-400 ">￥{{ item.price }}</span><span class="px-2">x</span>{{  item.num }} </div>
                        </div>
                    </div>
                    <div class="flex mt-3">
                        <span class="text-gray-400">成交价：</span>
                        <span class="pl-5 text-red-600 font-bold">￥{{ (item.price * item.num).toFixed(2) }}</span>
                    </div>
                </div>
            </div>
            
        </el-card>
        <el-card shadow="never" v-if="info.address" class="mb-3">
            <template #header>
                <strong class="text-sm">收货信息</strong>
            </template>
            <el-form label-width="90px">
                <el-form-item label="收货人：">
                    {{ info.address.name }}
                </el-form-item>
                <el-form-item label="联系方式：">
                    {{ info.address.phone }}
                </el-form-item>
                <el-form-item label="收货地址：">
                    {{ info.address.province + ' ' + info.address.city + ' ' + info.address.district + ' ' + info.address.address }}
                </el-form-item>
            </el-form>
            
        </el-card>
        <el-card shadow="never" v-if="info.refund_status != 'pending'">
            <template #header>
                <div class="w-full flex items-center justify-between">
                    <strong class="text-sm">退款信息</strong>
                    <el-button text disabled >{{ refund_status }}</el-button>
                </div>
            </template>
            <el-form label-width="90px">
                <el-form-item label="退款理由：">
                    {{ info.extra.refund_reason }}
                </el-form-item>
            </el-form>
            
        </el-card>

        <ship-info-modal ref="ShipInfoModalRef"></ship-info-modal>

    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import ShipInfoModal from './ShipInfoModal.vue'

const props = defineProps({
    info: {
        type: Object,
        default: () => ({})
    }
})

const drawerVisible = ref(false)
// 支付方式
const paymentMethod = (text) => {
    switch (text) {
        case "alipay":
            return '支付宝'
            break;
        case "wechat":
            return '微信'
            break;
        default:
            return text
            break;
    }
}

const paymentTime = (time) => {
    let date = new Date(time * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    return year + '-' + formatTime(month) + '-' + formatTime(day) + ' ' + formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second) 
}

const formatTime = (time) => {
    return parseInt(time) < 10 ? '0' + time : time
}

const skusTagCon = (obj) => {
    let arr = []
    for (const key in obj) {
        arr.push(obj[key].value)
    }
    return arr.join(',')
}

const refund_status = computed(() => {
    const opt = {
        pending: "未退款",
        applied: "已申请，等待审核",
        processing: "退款中",
        success: "退款成功",
        failed: "退款失败"
    }
    return props.info.refund_status ? opt[props.info.refund_status] : ""
})

const open = () => {
    console.log(props.info)
    drawerVisible.value = true
}


const ShipInfoModalRef = ref(null)
const shipInfoLoading = ref(false)
const openShipInfo = (id) => {
    shipInfoLoading.value = true
    ShipInfoModalRef.value.open(id)
    .finally(() => shipInfoLoading.value = false)
}


defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>