<template>
    <div class="main-container">
        <el-tabs v-model="searchForm.tab"  @tab-change="getTableData(1)">
            <el-tab-pane v-for="(item, index) in tabbars" :key="index"
                :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getTableData(1)" @reset="resetSearchForm">
                <search-item label="订单编号">
                    <el-input v-model="searchForm.no" clearable  placeholder="请输入订单编号"></el-input>
                </search-item>
                <template #show>
                    <search-item label="收货人">
                        <el-input v-model="searchForm.name" clearable  placeholder="收货人"></el-input>
                    </search-item>
                    <search-item label="手机号">
                        <el-input v-model="searchForm.phone" clearable  placeholder="手机号"></el-input>
                    </search-item>
                    <search-item label="开始日期">
                        <el-date-picker
                            v-model="searchForm.starttime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="开始日期"
                        />
                    </search-item>
                    <search-item label="结束日期">
                        <el-date-picker
                            v-model="searchForm.endtime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="结束日期"
                        />
                    </search-item>
                </template>
            </Search>
            
            
             <!-- 新增|刷新 -->
             <table-list-header 
                layout="refresh,download"
                @refresh="getTableData" 
                @download="downloadExportExcel"
            >
                    <el-popconfirm  
                        v-if="searchForm.tab != 'delete'"
                        title="是否批量删除该商品?" 
                        width="180" 
                        confirm-button-text="删除" 
                        cancel-button-text="取消" 
                        @confirm="handleMultiDelete(0)">
                            <template #reference>
                                <el-button type="danger">批量删除</el-button>
                            </template>
                    </el-popconfirm>
            </table-list-header>

            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex text-sm">
                            <div class="flex-1">
                                <p>订单号:</p>
                                <small>{{ row.no }}</small>
                            </div>
                            <div>
                                <p>下单时间:</p>
                                <small>{{ row.create_time }}</small>
                            </div>
                        </div>
                        <div class="flex items-center" v-for="(item, index) in row.order_items" :key="index">
                            <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover"
                                :lazy="true" style="width: 50px;height: 50px;"></el-image>
                            <p class=" text-blue-400 pl-2">
                                {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="total_price" label="实际付款" width="130" align="center" />
                <el-table-column  label="买家信息" width="140" align="center">
                    <template #default="{ row }">
                        <div class="text-gray-500">
                            {{ row.user.nickname || row.user.username }}
                            <p class=" text-xs">用户ID: {{ row.user.id }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="交易状态" width="170" align="center" >
                    <template #default="{ row }">
                        <div>
                            <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small" >微信支付</el-tag>
                            <el-tag v-else-if="row.payment_method == 'alipay'" size="small" >支付宝支付</el-tag>
                            <el-tag v-else type="info" size="small" >未支付</el-tag>
                        </div>
                        <div>
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small" >{{ row.ship_data ? '已发货' : '未发货' }}</el-tag>
                        </div>
                        <div>
                            <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small" >{{ row.ship_status == 'received' ? '已收货' : '未收货' }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="操作"  align="right">
                    <template #default="{ row }">
                        <el-button
                            size="small"
                            type="primary"
                            @click="openInfoDrawer(row)"
                        >订单详情</el-button>
                        <el-button
                            v-if="searchForm.tab === 'noship'"
                            size="small"
                            type="primary"
                        >订单发货</el-button>
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            size="small"
                            type="success"
                            @click="handleRefund(row.id, 1)"
                        >同意退款</el-button>
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            size="small"
                            type="danger"
                            @click="handleRefund(row.id, 0)"
                        >拒绝退款</el-button>
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


            <export-excel :tabs="tabbars" ref="exportExcelRef"></export-excel>
            <info-modal :info="info" ref="InfoModalRef"></info-modal> 


        </el-card>
    </div>
    
</template>

<script setup>
import { ref } from 'vue';
import { 
    get_order_list,
    delete_order_api, 
    refund_order_api
} from '~/api/order.js'
import { get_category_list } from '~/api/category.js'
import TableListHeader from '~/components/TableListHeader.vue';
import Search from '~/components/search/Search.vue'
import SearchItem from '~/components/search/SearchItem.vue'
import ExportExcel from './ExportExcel.vue'
import InfoModal from './InfoModal.vue'
import { toast, MessageBox, showPrompt } from '~/composables/util.js';

import { useInitTable} from '~/composables/useCommonList.js'


const {
    searchForm,
    resetSearchForm,
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
    handleMultiDelete
} = useInitTable({
    getTableApi: get_order_list,
    searchForm: {
        tab: 'all',
        no: null,
        starttime: null,
        endtime: null,
        name: null,
        phone: null
    },
    multiDeleteApi: delete_order_api
})


// 分类切换栏
const tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'nopay',
        name: '待支付'
    },
    {
        key: 'noship',
        name: '待发货'
    },
    {
        key: 'shiped',
        name: '待收货'
    },
    {
        key: 'received',
        name: '已收货'
    },
    {
        key: 'finish',
        name: '已完成'
    },
    {
        key: 'closed',
        name: '已关闭'
    },
    {
        key: 'refunding',
        name: '退款中'
    }
]

// 商品分类列表
const category_list = ref([])
get_category_list().then(res => {
    console.log('商品分类', res)
    category_list.value = res
})

// 导出数据
const exportExcelRef = ref(null)
const downloadExportExcel = () => {
    exportExcelRef.value.open()
}

// 打开订单详情
const InfoModalRef = ref(null) 
const info = ref(null)

const openInfoDrawer = (row) => {
    info.value = row
    InfoModalRef.value.open()
}

// 退款
const handleRefund = (id, agree) => {
    (agree ? MessageBox('是否要同意该订单退款') : showPrompt('请输入拒绝的理由'))
    .then(( { value } ) => {
        let data = {
            id,
            agree
        }
        if (!agree) {
            data.disagree_reason = value
        }
        refund_order_api(data)
        .then(res => {
            getTableData()
            toast('操作成功')
        })
    })
}

</script>

<style lang="scss" scoped>
.el-card {  
    // &:deep(.el-card__body) {
    //     overflow: hidden;
    //     display: flex;
    //     flex-direction: column;
    //     height: 100%;
    // }
    overflow: auto;
}
</style>