<template>
    <div class="main-container">
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 新增|刷新 -->
            <table-list-header @create="openDrawer" @refresh="getTableData">
                <el-popconfirm  title="是否批量删除选中规格?" width="180" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete()">
                    <template #reference>
                        <el-button
                            size="default"
                            type="danger"
                        >批量删除</el-button>
                    </template>
                </el-popconfirm>
            </table-list-header>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"  />
                <el-table-column prop="name" label="规格名称"  />
                <el-table-column prop="default" label="规格值" width="380" show-overflow-tooltip/>
                <el-table-column prop="order" label="排序" />
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
                <el-table-column  label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-popconfirm  title="是否删除此规格?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
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


            <form-drawer :title="drawerTitle + '规格'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="规格名称" prop="name">
                        <el-input v-model="formData.name" placeholder="规格名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="formData.order" :min="0" :max="10000"  />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                       <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"  />
                    </el-form-item>
                    <el-form-item label="规格值" prop="default">
                        <template v-if="dynamicTags.length > 0">
                            <el-tag
                                v-for="tag in dynamicTags"
                                :key="tag"
                                class="mx-1"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)"
                            >
                                {{ tag }}
                            </el-tag>
                        </template>
                        <el-input
                            v-if="inputVisible"
                            ref="InputRef"
                            v-model="inputValue"
                            class="ml-1 w-20"
                            size="small"
                            @keyup.enter="handleInputConfirm"
                            @blur="handleInputConfirm"
                        />
                        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                            + 添加值
                        </el-button>
                    </el-form-item>
                </el-form>
                
            </form-drawer>

        </el-card>
    </div>
    
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { toast } from '~/composables/util.js';
import { get_skusList_api, add_skus_api, delete_skus_api, update_skus_api, update_skus_status } from '~/api/skus.js'
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
    switchChange
} = useInitTable({
    getTableApi: get_skusList_api,
    updateStatusApi: update_skus_status
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
        status: 1,
        order: 1000,
        default: ''
    },
    formRules: {
        name: [
        { required: true, message: '请填写规格名称', trigger: 'blur' }
        ],
        default: [
            { required: true, message: '请添加规格值', trigger: 'blur' }
        ]
    },
    addApi: add_skus_api,
    updateApi: update_skus_api,
    getTableData
})

// 选中table列表
const deleteIds = ref([])

const handleSelectionChange = (val) => {
    deleteIds.value = val.map(v => v.id)
}

// 批量删除

const handleDelete = (id = 0) => {
    if (id) {
        delete_skus_api({
            ids: [id]
        }).then(res => {
            toast('删除成功')
            getTableData()
        })
    } else {
        if (deleteIds.value.length == 0) {
            return toast('请先选则要删除的规格', 'error')
        }
        delete_skus_api({
            ids: deleteIds.value
        }).then(res => {
            toast('删除成功')
            getTableData()
            deleteIds.value = []
        })
    }
}

// 添加规格值

const dynamicTags = computed({
    get() {
        return formData.default.length > 0 ? formData.default.split(',') : []
    },
    set(newValue) {
        console.log('newValue', newValue)
        formData.default = newValue.join(',')
    }
})

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)

const handleClose = (tag) => {
    let tempArr = dynamicTags.value
    tempArr.splice(tempArr.indexOf(tag), 1)
    dynamicTags.value = tempArr
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    let tempArr = dynamicTags.value
    tempArr.push(inputValue.value)
    dynamicTags.value = tempArr
  }
  inputVisible.value = false
  inputValue.value = ''
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

</style>