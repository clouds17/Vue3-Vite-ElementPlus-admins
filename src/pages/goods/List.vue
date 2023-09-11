<template>
    <div class="main-container">
        <el-tabs v-model="searchForm.tab"  @tab-change="getTableData(1)">
            <el-tab-pane v-for="(item, index) in tabbars" :key="index"
                :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getTableData(1)" @reset="resetSearchForm">
                <search-item label="关键词">
                    <el-input v-model="searchForm.title" clearable  placeholder="请输入商品名称"></el-input>
                </search-item>
                <template #show>
                    <search-item label="商品分类">
                        <el-select v-model="searchForm.category_id"  placeholder="请选择商品分类" clearable class=" w-full">
                            <el-option v-for="item in category_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </search-item>
                </template>
            </Search>
            
            
             <!-- 新增|刷新 -->
             <table-list-header 
                layout="create, refresh, delete"
                title="商品"
                @create="openDrawer" 
                @refresh="getTableData" 
                @delete="handleMultiDelete" >
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" @click="goodsManager(1)">上架</el-button>
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" @click="goodsManager(0)">下架</el-button>
            </table-list-header>

            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <h5 class="font-md font-bold text-dark-300">{{ row.title }}</h5>
                        <div class="flex items-center">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;"></el-image>
                            <div class="flex-1">
                                
                                <div>
                                    <span class="text-rose-500 text-xs font-bold">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类: {{ row.category ? row.category.name : '未分类' }}</p>
                                <p class="text-gray-400 text-xs">创建时间: {{ row.create_time}}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sale_count" label="实际销量" width="110" align="center" />
                <el-table-column  label="商品状态" width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small" >{{ row.status ? '上架' : '仓库' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="审核状态" width="140" align="center" v-if="searchForm.tab != 'delete'">
                    <template #default="{ row }">
                        <div v-if="row.ischeck == 0">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="mt-1" type="danger" size="small" plain style="margin-left: 0 !important;">审核拒绝</el-button>
                        </div>
                        <el-tag v-else-if="row.ischeck == 1" type="success" size="small"  effect="plain">通过</el-tag>
                        <el-tag v-else type="danger" size="small"  effect="plain">拒绝</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="总库存" width="110" align="center" />
                <el-table-column  label="操作"  align="right">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button 
                                class="px-1"
                                size="small" 
                                type="primary"
                                @click="handleEdit(scope.row)"
                            >修改</el-button>
                            <el-button 
                                class="px-1"
                                size="small" 
                                type="primary"
                                :loading="scope.row.skusLoading"
                                @click="handleSetGoodsSkus(scope.row)"
                            >商品规格</el-button>
                            <el-button 
                                class="px-1"
                                size="small" 
                                :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                :loading="scope.row.bannersLoading"
                                @click="handleSetGoodsBanners(scope.row)"
                            >设置轮播图</el-button>
                            <el-button 
                                class="px-1"
                                size="small" 
                                :type="!scope.row.content ? 'danger' : 'primary'"
                                :loading="scope.row.contentLoading"
                                @click="handleSetGoodsContent(scope.row)"
                            >商品详情</el-button>
                            <el-popconfirm  title="是否删除该商品?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleMultiDelete(scope.row.id)">
                                <template #reference>
                                    <el-button
                                        size="small"
                                        type="danger"
                                    >删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <sapn v-else>暂无操作</sapn>
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


            <form-drawer :title="drawerTitle + '商品'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="90px" :inline="false" size="default">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="formData.title" placeholder="请输入商品名称" class="mr-5"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="formData.category_id" placeholder="请选择商品分类" clearable filterable >
                            <el-option label="--请选择商品分类--" value="--" disabled />
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品封面" prop="cover">
                        <choose-image v-model="formData.cover"></choose-image>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="formData.desc" placeholder="请输入商品描述" type="textarea" :rows="4" class="mr-5"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单位" prop="unit">
                        <el-input v-model="formData.unit" placeholder="请输入商品单位" class="mr-5"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock">
                        <el-input type="number" v-model="formData.stock" style="max-width: 300px">
                            <template #append>{{ formData.unit }}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input type="number" v-model="formData.min_stock" style="max-width: 300px">
                            <template #append>{{ formData.unit }}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售价" prop="min_price">
                        <el-input type="number" v-model="formData.min_price" style="max-width: 300px">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input type="number" v-model="formData.min_oprice" style="max-width: 300px">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="0" border>存放仓库</el-radio>
                            <el-radio :label="1" border>立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="formData.stock_display">
                            <el-radio :label="0" border>隐藏</el-radio>
                            <el-radio :label="1" border>显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                </el-form>
                
            </form-drawer>


            <Banners ref="bannersRef" @reload-data="getTableData"></Banners>
            <Content ref="contentRef" @reload-data="getTableData"></Content>
            <Skus ref="skusRef" @reload-data="getTableData"></Skus>
        </el-card>
    </div>
    
</template>

<script setup>
import { ref } from 'vue';
import { get_goods_list, add_goods_api, update_goods_api, delete_goods_api, update_goods_status } from '~/api/goods.js'
import { get_category_list } from '~/api/category.js'
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from '~/components/ChooseImage.vue'
import TableListHeader from '~/components/TableListHeader.vue';
import Search from '~/components/search/Search.vue'
import SearchItem from '~/components/search/SearchItem.vue'
import { toast } from '~/composables/util.js';
import Banners from '~/pages/goods/Banners.vue';
import Content from '~/pages/goods/Content.vue';
import Skus from '~/pages/goods/Skus.vue';

import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'


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
    getTableApi: get_goods_list,
    searchForm: {
        title: '',
        tab: 'all',
        category_id: null
    },
    multiDeleteApi: delete_goods_api
})

// 表单部分
const {
    formDrawerRef,
    drawerTitle,
    formRef,
    formData,
    formRules,
    openDrawer,
    closeDrawer,
    handleSubmit,
    handleEdit
} = useManipulateTable({
    formData: {
        title: '',
        category_id: null,
        cover: '',
        desc: '',
        unit: '件',
        stock: 0,
        min_stock: 0,
        status: 1,
        stock_display: 1,
        min_price: 0,
        min_oprice: 0
    },
    formRules: {
        title: [
            { required: true, message: '请填写商品名称', trigger: 'blur' }
        ]
    },
    addApi: add_goods_api,
    updateApi: update_goods_api,
    getTableData
})
// 分类切换栏
const tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'checking',
        name: '审核中'
    },
    {
        key: 'saling',
        name: '出售中'
    },
    {
        key: 'off',
        name: '已下架'
    },
    {
        key: 'min_stock',
        name: '库存预警'
    },
    {
        key: 'delete',
        name: '回收站'
    }
]

// 商品分类列表
const category_list = ref([])
get_category_list().then(res => {
    console.log('商品分类', res)
    category_list.value = res
})

// 商品批量上下架
const goodsManager = (status) => {
    isLoading.value = true
    update_goods_status({
        ids: deleteIds.value,
        status
    }).then(res => {
        toast(status ? '上架成功' : '下架成功')
        if (multipleTableRef.value) {
            multipleTableRef.value.clearSelection()
        }
        getTableData()
        deleteIds.value = []
    }).finally(() => {
        isLoading.value = false
    })

}


// 打开轮播图
const bannersRef = ref(null)
const handleSetGoodsBanners = (row) => {
    bannersRef.value.open(row)
}

// 打开商品详情
const contentRef = ref(null)
const handleSetGoodsContent = (row) => {
    contentRef.value.open(row)
}

// 打开商品规格
const skusRef = ref(null)
const handleSetGoodsSkus = (row) => {
    skusRef.value.open(row)
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