<template>
    <el-drawer title="导出数据" v-model="exportVisible" size="40%" :before-close="close"
        :destroy-on-close="true" :show-close="true" :wrapperClosable="true" >
        <el-form :model="excelForm" ref="excelFormRef" label-width="80px">
            <el-form-item label="订单类型">
                <el-select v-model="excelForm.tab"  placeholder="订单类型" >
                    <el-option v-for="item in tabs"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                    v-model="excelForm.times"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="onSubmit">导出</el-button>
            </el-form-item>
        </el-form>
      
        
    </el-drawer>
    
    
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { excelexport_order_list } from '~/api/order.js'
import { toast } from '~/composables/util.js';


defineProps({
    tabs: Array
})

const exportVisible = ref(false)

const excelForm = reactive({
    tab: 'all',
    times: '',
    starttime: '',
    endtime: ''
})

watch(
  () => excelForm.times,
  (newValue) => {
    if (!Array.isArray(newValue)) {
        excelForm.starttime =  ''
        excelForm.endtime =  ''
        return false
    }
    excelForm.starttime = newValue[0] || ''
    excelForm.endtime = newValue[1] || ''
  }
)

const open = () => exportVisible.value = true

const close = () => {
    excelForm.tab = 'all'
    excelForm.times = ''
    exportVisible.value = false
}
const loading = ref(false)
const onSubmit = () => {
    loading.value = true
    excelexport_order_list(excelForm)
    .then(data => {
        let url = window.URL.createObjectURL(new Blob([ data ]))
        let link = document.createElement("a")
        link.style.display = "none"
        link.href = url
        let filename = Date.now() + ".xlsx"
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        toast('导出成功')
        close()
    }).finally(() => {
        loading.value = false
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>