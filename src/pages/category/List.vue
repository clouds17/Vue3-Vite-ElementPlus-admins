<!-- 权限管理 -->
<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>
        <div v-loading="isLoading" class="overflow-y-auto el-tree-container">
            <el-tree :data="tableData" :props="defaultProps" node-key="id" >
                <template #default="{ node, data }">
                   <div class="flex items-center flex-1">
                        <span>{{ node.label }}</span>
                        <div class="ml-auto mr-4">
                            <el-button type="primary" size="small" :loading="data.goodsDrawerLoading" text @click.stop="openGoodsDrawer(data)">推荐商品</el-button>
                            <el-switch 
                                :modelValue="data.status" 
                                :active-value="1" 
                                :inactive-value="0" 
                                class="mr-3" 
                                :loading="data.isLoading"
                                @change="switchChange($event, data)"
                            ></el-switch>
                            <el-button type="primary" size="small" text @click.stop="handleEdit(data)">修改</el-button>
                            <el-button type="primary" size="small" text @click.stop="handleDelete(data.id)">删除</el-button>
                        </div>
                   </div>
                </template>
            </el-tree>

        </div>
        <form-drawer :title="drawerTitle + '分类'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
            <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
            </el-form>
            
        </form-drawer>

        <goods-drawer ref="goodsDrawerRef"></goods-drawer>
    </el-card>
</template>

<script setup>

import { ref } from 'vue';
import TableListHeader from '~/components/TableListHeader.vue';
import { get_category_list, add_category_api, update_category_api, update_category_status, delete_category_api } from '~/api/category.js';
import FormDrawer from "~/components/FormDrawer.vue";
import GoodsDrawer from './components/GoodsDrawer.vue';

import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'


const {
    tableData,
    isLoading,
    getTableData,
    handleDelete,
    switchChange
} = useInitTable({
    getTableApi: get_category_list,
    onGetListSuccess: (res) => {
        tableData.value = res.map(o => {
            o.goodsDrawerLoading = false
            return o
        })
    },
    deleteApi: delete_category_api,
    updateStatusApi: update_category_status
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
        name: '',
    },
    formRules: {
        name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
    },
    addApi: add_category_api,
    updateApi: update_category_api,
    getTableData
})


const defaultProps = {
  children: 'child',
  label: 'name',
}


// 打开推荐商品
const goodsDrawerRef = ref(null)
const openGoodsDrawer = (data) => {
    goodsDrawerRef.value.open(data)
}

</script>

<style lang="scss" scoped>
.el-card {
    &:deep(.el-card__body) {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
.el-tree-container {
    &:deep(.el-button+.el-button) {
        margin-left: 0;
    }
    &:deep(.el-tree-node__content) {
        box-sizing: content-box;
        padding: 5px 0;
    }
}
</style>