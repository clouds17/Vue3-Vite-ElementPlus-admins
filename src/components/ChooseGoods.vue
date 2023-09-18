<template>
    <el-dialog
        title="商品选择"
        v-model="dialogVisible"
        :destroy-on-close="true"
        width="80%"
        top="5vh">
        <el-card shadow="never" class="h-[63vh] border-0 h-full">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getTableData(1)" :isShowReset="false">
                <search-item label="关键词">
                    <el-input v-model="searchForm.title" clearable  placeholder="请输入商品名称"></el-input>
                </search-item>
            </Search>
            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" >
                    <template #default="{ row }">
                        <h5 class="font-md font-bold text-dark-300">{{ row.title }}</h5>
                        <div class="flex items-center">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;"></el-image>
                            <div class="flex-1">
                                
                                
                                <p class="text-gray-400 text-xs mb-1">分类: {{ row.category ? row.category.name : '未分类' }}</p>
                                <p class="text-gray-400 text-xs">创建时间: {{ row.create_time}}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="总库存" width="130" align="center" />
                <el-table-column  label="价格(元)" width="350" align="center">
                    <template #default="{ row }">
                            <span class="text-rose-500 text-sm font-bold">￥{{ row.min_price }}</span>
                            <el-divider direction="vertical" />
                            <span class="text-gray-500 text-sm">￥{{ row.min_oprice }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                class=" mt-6 flex items-center justify-center"
                background 
                layout="prev, pager, next" 
                :total="totalCount" 
                :current-page="page" 
                :page-size="limit" 
                @current-change="changePage" />
        </el-card>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<script setup>
import { ref } from 'vue';
import { 
    get_goods_list,
} from '~/api/goods.js'

import Search from '~/components/search/Search.vue';
import SearchItem from '~/components/search/SearchItem.vue';
import { useInitTable } from '~/composables/useCommonList.js'

const {
    searchForm,
    tableData,
    isLoading,
    page,
    limit,
    totalCount,
    getTableData,
    changePage,
    deleteIds,
    handleSelectionChange,
    multipleTableRef,
} = useInitTable({
    getTableApi: get_goods_list,
    searchForm: {
        title: '',
    },
})

const dialogVisible = ref(false)

const callBackFunction = ref(null)
const open = (callBack = null) => {
    callBackFunction.value = callBack
    dialogVisible.value = true
}
const close = () => {
    dialogVisible.value = false
}

const onSubmit = () => {
    if (typeof callBackFunction.value == 'function') {
        callBackFunction.value(deleteIds.value)
        close()
    }
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>