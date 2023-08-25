<template>
    <div class="main-container">
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 新增|刷新 -->
            <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column prop="title" label="公告标题"  />
                <el-table-column prop="create_time" label="发布事件" width="380" />
                <el-table-column  label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-popconfirm  title="是否删除此公告?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="danger"
                                >删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                class=" mt-6 flex items-center justify-center"
                background 
                layout="prev, pager, next" 
                :total="totalCount" 
                :current-page="page" 
                :page-size="10" 
                @current-change="changePage" />


            <form-drawer :title="drawerTitle + '公告'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="公告标题" prop="title">
                        <el-input v-model="formData.title" placeholder="公告标题"></el-input>
                    </el-form-item>
                    <el-form-item label="公告内容" prop="content">
                        <el-input v-model="formData.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
                
            </form-drawer>

        </el-card>
    </div>
    
</template>

<script setup>
import { get_noticeList_api, add_notice_api, delete_notice_api, update_notice_api } from '~/api/notice.js'
import FormDrawer from "~/components/FormDrawer.vue";
import TableListHeader from '~/components/TableListHeader.vue';
import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'

const {
    tableData,
    isLoading,
    page,
    limit,
    totalCount,
    getTableData,
    changePage,
    handleDelete
} = useInitTable({
    getTableApi: get_noticeList_api,
    deleteApi: delete_notice_api
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
        content: ''
    },
    formRules: {
        title: [
        { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
        content: [
            { required: true, message: '请填写公告内容', trigger: 'blur' }
        ]
    },
    addApi: add_notice_api,
    updateApi: update_notice_api,
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