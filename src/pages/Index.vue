<template>
    <div>
        <el-row :gutter="20">
            <template v-if="panels.length == 0">
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
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
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
        
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import CountTo from '~/components/CountTo.vue'

const store = useStore()
const panels = ref([])

store.dispatch('Statistics1')
    .then(res => {
        console.log('统计1', res)
        panels.value = res.panels
    })

store.dispatch('Statistics2')
    .then(res => {
        console.log('统计2', res)
    })

store.dispatch('Statistics3')
    .then(res => {
        console.log('统计3', res)
    })


</script>

<style lang="scss" scoped>

</style>