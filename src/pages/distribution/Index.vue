<template>
    <div class="main-container">
        <panel />

        <el-card shadow="never" class=" border-0  ">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getTableData(1)" @reset="resetSearchForm">
                
                <search-item label="时间选择">
                    <el-radio-group v-model="searchForm.type" >
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="today">今天</el-radio-button>
                        <el-radio-button label="yesterday">昨天</el-radio-button>
                        <el-radio-button label="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </search-item>
                <template #show>
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
                    <search-item label="关键词">
                        <el-input v-model="searchForm.keyword" clearable  placeholder="请输入手机号/邮箱/用户名称搜索" style="width: 80%;"></el-input>
                    </search-item>
                </template>
            </Search>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column label="ID" prop="id" width="90" align="center" />
                <el-table-column label="头像" width="100">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img
                                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                            />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息"  width="180" >
                    <template #default="{ row }">
                        <div class="text-gray-500 text-sm">
                            <p>用户：{{ row.username || '' }}</p>
                            <p>昵称：{{ row.nickname || '' }}</p>
                            <p>姓名：{{ row.user_info?.name || '' }}</p>
                            <p>电话：{{ row.phone || '' }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="推广用户数量" prop="share_num"  align="center" />
                <el-table-column label="订单数量" prop="share_order_num"  align="center" />
                <el-table-column label="订单金额" prop="order_price"  align="center" />
                <el-table-column label="账户佣金" prop="commission"  align="center" />
                <el-table-column label="已提现金额" prop="cash_out_price"  align="center" />
                <el-table-column label="提现次数" prop="cash_out_time"  align="center" />
                <el-table-column label="未提现金额" prop="no_cash_out_price"  align="center" />
                
                <el-table-column  label="操作" width="180" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="dataDrawerOpen(row.id)"
                        >推广人</el-button>
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="dataDrawerOpen(row.id, 'order')"
                        >推广订单</el-button>
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

        <DataDrawer ref="dataDrawerRef" type="user"/>
        <DataDrawer ref="orderDataDrawerRef" type="order"/>
    </div>
</template>

<script setup>
import panel from './panel.vue';
import DataDrawer from './dataDrawer.vue';
import { ref } from 'vue';
import { statistics_list } from '~/api/distribution.js'
import Search from '~/components/search/Search.vue'
import SearchItem from '~/components/search/SearchItem.vue'

import { useInitTable } from '~/composables/useCommonList.js'


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
} = useInitTable({
    getTableApi: statistics_list,
    searchForm: {
        keyword: '',
        type: 'all',
        starttime: null,
        endtime: null
    },
    onGetListSuccess: (res) => {
        tableData.value = res.list
        totalCount.value = res.totalCount
    },
})

const dataDrawerRef = ref(null)
const orderDataDrawerRef = ref(null)
const dataDrawerOpen = (id, type = 'user') => {
    type == 'user' ? dataDrawerRef.value.open(id) : orderDataDrawerRef.value.open(id)
}

</script>

<style lang="scss" scoped>
.el-card {
    overflow-y: auto;
    overflow-x: hidden;
    // &:deep(.el-card__body) {
    //     overflow: hidden;
    //     display: flex;
    //     flex-direction: column;
    //     height: 100%;
    // }
}
</style>
