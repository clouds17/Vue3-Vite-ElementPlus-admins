<template>
    <el-dialog
        title="规格选择"
        v-model="dialogVisible"
        width="80%"
        top="5vh"
    >
        <el-container style="height: 60vh;">
            <el-aside width="250px" class="border-r border-gray-300">
                <div class="content">
                    <div 
                        class="aside-list"
                        v-for="(item, index) in tableData" 
                        :key="index"
                        :class="{ active: activeIndex == index}"
                        :active="activeIndex == index"
                        @click="chooseSku(index)"
                    >{{ item.name }}</div>
                </div>
                <div class="paging">
                    <el-pagination 
                        background 
                        layout="prev, next" 
                        :total="totalCount" 
                        :page-size="limit"
                        :current-page="page"
                        @current-change="changePage"
                    />
                </div>
            </el-aside>
            <el-main height="">
                <el-checkbox-group v-model="form.list" >
                    <el-checkbox v-for="item in list" :key="item" :label="item" border>
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<script setup>
import { ref, reactive } from 'vue';
import { get_skusList_api } from '~/api/skus.js'
import { useInitTable } from '~/composables/useCommonList.js'
const {
    tableData,
    isLoading,
    page,
    limit,
    totalCount,
    getTableData,
    changePage,
} = useInitTable({
    getTableApi: get_skusList_api
})


const dialogVisible = ref(false)

const callBackFunc = ref(null)

const open = (callBack = null) => {
    callBackFunc.value = callBack
    chooseSku(0)
    dialogVisible.value = true
}

const activeIndex = ref(-1)
const list = ref([])

const form = reactive({
    name: '',
    list: []
})


function chooseSku(index) {
    // tableData
    if (activeIndex.value == index) return
    activeIndex.value = index
    form.list = []
    const curItem = tableData.value[index] || {}
    list.value = curItem?.default?.split(',') || []
    form.name = curItem?.name || ''
}

const onSubmit = () => {
    if (typeof callBackFunc.value == 'function') {
        callBackFunc.value(form)
        dialogVisible.value = false
    }
}

defineExpose({
    open
})



</script>

<style lang="scss" scoped>

.el-aside {
    padding-top: 20px;
    height: 100%;
    padding-bottom: 0px !important;
    @apply flex flex-col;
    .content {
        flex: 1;
        overflow: auto;
    }
    .paging {
        height: 50px;
        @apply flex items-center justify-center;
    }
}
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover, .active {
    @apply bg-blue-50;
}
</style>