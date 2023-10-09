<template>
    <el-drawer title="物流信息" v-model="drawerVisible"  size="40%">
       <el-card shadow="never" class="border-0">
            <template #header>
                <div class="flex items-center">
                    <el-image :src="shipInfo.logo" fit="fill" :lazy="true" style="width: 60px;height: 60px;" class="rounded border"></el-image>
                    <div class="text-sm ml-3 text-gray-500">
                        <p>物流公司： {{ shipInfo.typename }}</p>
                        <p>物流单号： {{ shipInfo.number }}</p>
                    </div>
                </div>
            </template>
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in shipInfo.list"
                :key="index"
                :timestamp="activity.time"
                >
                {{ activity.status }}
                </el-timeline-item>
            </el-timeline>
       </el-card>
      
       
    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { get_ship_info } from '~/api/order.js'
import { toast } from '~/composables/util.js';


const drawerVisible = ref(false)

const shipInfo = ref(null)
const open = (id) => {
    return get_ship_info({
        id
    }).then(res => {
        if (res.status != 0) {
            return toast(res.msg, 'error')
        }
        shipInfo.value = res.result
        console.log(shipInfo.value)
        drawerVisible.value = true
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>