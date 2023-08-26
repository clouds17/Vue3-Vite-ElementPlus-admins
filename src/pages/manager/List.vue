<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 搜索 -->
        <el-form :model="searchForm" :inline="true"> 
            <el-form-item label="关键词">
                <el-input class="w-[300px]" v-model="searchForm.keyword" clearable  placeholder="请输入管理员昵称搜索"></el-input>
            </el-form-item>
            <el-form-item class="flex items-center justify-end">
                <el-button  type="primary" @click="getTableData(1)">搜索</el-button>
                <el-button  @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        
        <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>
        
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column label="管理员" width="300">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img
                                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                            />
                        </el-avatar>
                        <div class="ml-2 leading-normal">
                            <h3>{{ row.username }}</h3>
                            <small class="mt-1">ID: {{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="role.name" label="所属角色"  align="center" />
            <el-table-column  label="状态" width="170" >
                <template #default="{ row }">
                    <el-switch 
                        :disabled="row.super == 1"
                        :modelValue="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.isLoading"
                        @change="switchChange($event, row)"
                    />
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="180" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super == 1" class="text-gray-500">暂无操作</small>
                    <div v-else>
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-popconfirm  title="是否删除该角色?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="danger"
                                >删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
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


        <form-drawer :title="drawerTitle + '管理员'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
            <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                <el-form-item label="头像" prop="avatar">
                    <choose-image v-model="formData.avatar"></choose-image>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" placeholder="请输入密码" showPassword></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="formData.role_id" placeholder="请选择角色" clearable filterable >
                        <el-option label="--请选择角色--" value="--" disabled />
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch 
                        v-model="formData.status"
                        :active-value="1"
                        :inactive-value="0"
                    />
                </el-form-item>
                
            </el-form>
            
        </form-drawer>

    </el-card>
    
</template>

<script setup>
import { ref } from 'vue';
import { get_manager_list, add_manager_api, update_manager_api, delete_manager_api, update_manager_status } from '~/api/manager.js'
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from '~/components/ChooseImage.vue'
import TableListHeader from '~/components/TableListHeader.vue';

import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'

const roles = ref([])

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
    handleDelete,
    switchChange
} = useInitTable({
    getTableApi: get_manager_list,
    searchForm: {
        keyword: ''
    },
    onGetListSuccess: (res) => {
        roles.value = res.roles || []
        tableData.value = res.list
        totalCount.value = res.totalCount
    },
    deleteApi: delete_manager_api,
    updateStatusApi: update_manager_status
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
        username: '',
        password: '',
        role_id: '',
        status: 1,
        avatar: ''
    },
    formRules: {
        username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
        ]
    },
    addApi: add_manager_api,
    updateApi: update_manager_api,
    getTableData
})

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
</style>