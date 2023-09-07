<template>
    <div class="main-container">
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 新增|刷新 -->
            <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column  label="优惠券名称" width="350">
                    <template #default="{ row }">
                        <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                            <h5 class="font-bold text-md">{{ row.name }} </h5>
                            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态"  />
                <el-table-column  label="优惠" >
                    <template #default="{ row }">
                        <div>
                            {{ row.type == 0 ? `满减 ￥${row.value}` : `折扣 ${row.value}折` }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="发放数量"  />
                <el-table-column prop="used" label="已使用"  />

                <el-table-column  label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button 
                            v-if="scope.row.statusText == '未开始'"
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-popconfirm  v-if="scope.row.statusText != '领取中'"
                            title="是否删除此公告?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="danger"
                                >删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm  v-if="scope.row.statusText == '领取中'"
                            title="是否让此优惠券失效?" width="160" confirm-button-text="失效" cancel-button-text="取消" @confirm="handleChangeStatus(scope.row.id)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="warning"
                                >失效</el-button>
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


            <form-drawer :title="drawerTitle + '优惠券'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="120px" :inline="false" size="default">
                    <el-form-item label="优惠券名称" prop="name">
                        <el-input v-model="formData.name" placeholder="优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="formData.type">
                            <el-radio :label="0" border>满减</el-radio>
                            <el-radio :label="1" border>折扣</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="面值" prop="value">
                        <el-input v-model="formData.value" placeholder="面值" >
                            <template #append>{{ formData.value ? '折' : '元' }}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="发行量" prop="total">
                        <el-input-number v-model="formData.total" :min="0" :max="10000"  />
                    </el-form-item>
                    <el-form-item label="最低使用价格" prop="min_price">
                        <el-input v-model="formData.min_price" placeholder="最低使用价格" type="number">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选择时间" >
                        <el-date-picker
                            v-model="timeRanger"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            type="datetimerange"
                            :editable = false
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="formData.order" :min="0" :max="10000"  />
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="formData.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
                
            </form-drawer>

        </el-card>
    </div>
    
</template>

<script setup>
import { get_couponList_api, add_coupon_api, delete_coupon_api, update_coupon_api, update_coupon_status } from '~/api/coupon.js'
import FormDrawer from "~/components/FormDrawer.vue";
import TableListHeader from '~/components/TableListHeader.vue';
import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'
import { computed } from 'vue';
import { toast } from '~/composables/util.js';

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
    getTableApi: get_couponList_api,
    deleteApi: delete_coupon_api
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
        type: 0,
        value: 0,
        total: 0,
        min_price: 0,
        start_time: null,
        end_time: null,
        order: 50,
        desc: ''
    },
    formRules: {
        name: [
            { required: true, message: '请填写优惠券名称', trigger: 'blur' }
        ]
    },
    addApi: add_coupon_api,
    updateApi: update_coupon_api,
    getTableData,
    beforeSubmit: (data) => {
        console.log('beforeSubmit', data)
        if (typeof data.start_time != 'number') {
            data.start_time = new Date(data.start_time).getTime()
            data.end_time = new Date(data.end_time).getTime()
        }
        return data
    }
})


const timeRanger = computed({
    get: () => {
        return formData.start_time && formData.end_time ? [formData.start_time, formData.end_time] : []
    },
    set: (val) => {
        formData.start_time = val[0]
        formData.end_time = val[1]
    }
})

// 失效
const handleChangeStatus = (id) => {
    isLoading.value = true
    update_coupon_status({
        id
    }).then(res => {
        toast('该优惠券失效成功')
        getTableData()
    }).finally(() => {
        isLoading.value = false
    })
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
.active {
    @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}

</style>