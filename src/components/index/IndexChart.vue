<template>
    <el-card shadow="never" >
        <template #header>
        <div class="flex items-center justify-between text-sm">
            <span>订单统计</span>
            <div>
                <el-check-tag 
                    v-for="(item, index) in typeOptions" :key="index" 
                    :checked="currentType == item.type" 
                    size='small' class="ml-2"
                    @click="handleChoose(item.type)"
                >{{item.value}}</el-check-tag>
            </div>
        </div>
        </template>
        <!-- card body -->
        <div id="chart-main" ref="echatRef" style="height: 300px;" class="w-full"></div>
    </el-card>
    
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useStore } from "vuex";
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts';



const store = useStore()
const currentType = ref('week')
const typeOptions = [{
    type: 'month',
    value: '近1个月'
},{
    type: 'week',
    value: '近1周'
},{
    type: 'hour',
    value: '近24小时'
}]

// 切换tag
const handleChoose = (type) => {
    currentType.value = type
    getDate(type)
}

let myChart = null
onMounted(() => {
    let chartDom = document.getElementById('chart-main');
    myChart = echarts.init(chartDom);

    getDate()

})
function getDate(type = 'week') {
    myChart.showLoading()
    store.dispatch('Statistics3', {
        type
    })
    .then(res => {
        renderData(res)
    })
    .finally(() => {
        myChart.hideLoading()
    })
}

function renderData(data = {}) {
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.x
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: data.y,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            }
            }
        ]
    };
    option && myChart.setOption(option);
}

onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})


// 当窗口大小改变时,图表显示大小改变
const echatRef = ref(null)
useResizeObserver(echatRef, (entries) => {
    myChart.resize()
})

    



</script>

<style lang="scss" scoped>

</style>