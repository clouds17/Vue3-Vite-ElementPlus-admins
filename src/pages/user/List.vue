<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 搜索 -->
        <Search :model="searchForm" @search="getTableData(1)" @reset="resetSearchForm">
            <search-item label="关键词">
                <el-input v-model="searchForm.keyword" clearable  placeholder="请输入手机号/邮箱/用户名称搜索"></el-input>
            </search-item>
            <template #show>
                <search-item label="会员等级">
                    <el-select v-model="searchForm.user_level_id" value-key="id" placeholder="请选择会员等级" clearable filterable style="width: 100%;">
                        <el-option v-for="item in user_level"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </search-item>
            </template>
        </Search>
        
        <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column label="会员" width="220">
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
            <el-table-column label="会员等级"  align="center" >
                <template #default="{ row }">
                    {{ row.user_level?.name || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="登录注册"  align="center" >
                <template #default="{ row }">
                    <p v-if="row.last_login_time">
                        <span>最近登录:</span><span>{{ row.last_login_time }}</span>
                    </p>
                    <p>
                        <span>注册时间:</span><span>{{ row.create_time }}</span>
                    </p>
                    
                </template>
            </el-table-column>

            <el-table-column  label="状态" width="170"  align="center">
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
                            @click="handleEdit(scope.row)"
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
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="formData.user_level_id" placeholder="请选择会员等级" clearable filterable >
                        <el-option label="--请选择会员等级--" value="--" disabled />
                        <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id" />
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
import { get_userList_api, add_user_api, update_user_api, delete_user_api, update_user_status } from '~/api/user.js'
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from '~/components/ChooseImage.vue'
import TableListHeader from '~/components/TableListHeader.vue';
import Search from '~/components/search/Search.vue'
import SearchItem from '~/components/search/SearchItem.vue'

import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'

const roles = ref([])

const user_level = ref([])

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
    getTableApi: get_userList_api,
    searchForm: {
        keyword: '',
        user_level_id: ''
    },
    onGetListSuccess: (res) => {
        tableData.value = res.list
        totalCount.value = res.totalCount
        user_level.value = res.user_level || []
    },
    deleteApi: delete_user_api,
    updateStatusApi: update_user_status
})

// 自定义验证规则
const checkPhone = (rule, value, callback) => {
    const reg =  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (!reg.test(value)) {
        return callback(new Error("请填写正确的手机号"))
    }
    callback()
}
const checkEmail = (rule, value, callback) => {
    const reg =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (!reg.test(value)) {
        return callback(new Error("请填写正确的邮箱"))
    }
    callback()
}

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
        user_level_id: 3,
        phone: '',
        nickname: '',
        email: '',
        status: 1,
        avatar: ''
    },
    formRules: {
        username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        phone: [
            { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
            { validator: checkEmail, trigger: 'blur' }
        ]
    },
    addApi: add_user_api,
    updateApi: update_user_api,
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