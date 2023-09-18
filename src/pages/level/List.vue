<template>
    <div class="main-container">
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 新增|刷新 -->
            <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column prop="name" label="会员等级"  />
                <el-table-column prop="discount" label="折扣率(%)"  />
                <el-table-column prop="level" label="等级权重"  />
                <el-table-column label="状态" >
                    <template #default="{ row }">
                        <el-switch 
                            :modelValue="row.status"
                            :active-value="1"
                            :inactive-value="0"
                            :loading="row.isLoading"
                            @change="switchChange($event, row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="250" align="center">
                    <template #default="scope">
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-popconfirm  title="是否删除此记录?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
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


            <form-drawer :title="drawerTitle + '角色'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="等级名称" prop="name">
                        <el-input v-model="formData.name" placeholder="等级名称"></el-input>
                    </el-form-item>
                    <el-form-item label="等级权重" prop="level">
                        <el-input v-model="formData.level" placeholder="等级权重" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-switch 
                            v-model="formData.status"
                            :active-value="1"
                            :inactive-value="0"
                        />
                    </el-form-item>
                    <el-form-item label="升级条件" >
                        <div class="w-full">
                            <small class="mr-3 text-sm text-gray-500">累计消费满</small>
                            <el-input v-model="formData.max_price" placeholder="累计消费" type="number" style="width: 50%;">
                                <template #append>元</template>
                            </el-input>
                            <p class="text-sm text-gray-400 mt-2">设置会员等级所需要的累计消费必须大于等于0元</p>
                        </div>
                        <div class="w-full mt-5">
                            <small class="mr-3 text-sm text-gray-500">累计购买次数</small>
                            <el-input v-model="formData.max_times" placeholder="累次次数" type="number" style="width: 50%;">
                                <template #append>次</template>
                            </el-input>
                            <p class="text-sm text-gray-400 mt-2">设置会员等级所需要的购买量必须大于等于0</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="折扣率">
                        <el-input v-model="formData.discount" placeholder="折扣率" type="number" style="width: 50%;">
                            <template #append>%</template>
                        </el-input>
                        <p class="text-sm text-gray-400 mt-2">折扣率单位为百分比，如输入90，便是该会员等级的用户可以以商品原价的90%购买</p>
                    </el-form-item>
                </el-form>
                
            </form-drawer>

            

        </el-card>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util.js';
import { get_levelList_api, add_level_api, delete_level_api, update_level_api, update_level_status } from '~/api/level.js'
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
    handleDelete,
    switchChange
} = useInitTable({
    getTableApi: get_levelList_api,
    deleteApi: delete_level_api,
    updateStatusApi: update_level_status
})

console.log('tableData', tableData)
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
        level: 100,
        discount: 0,
        status: 1,
        max_price: 0,
        max_times: 0
    },
    formRules: {
        name: [
            { required: true, message: '请填写会员等级名称', trigger: 'blur' }
        ]
    },
    addApi: add_level_api,
    updateApi: update_level_api,
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