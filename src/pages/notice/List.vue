<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 新增|刷新 -->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="default" @click="openDrawer">新增</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button type="text" @click="getTableData">
                    <el-icon :size="18"><Refresh /></el-icon>
                </el-button>
            </el-tooltip>
        </div>
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
            <el-form :model="formData" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="formData.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="formData.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
            
        </form-drawer>

    </el-card>
    
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { get_noticeList_api, add_notice_api, delete_notice_api, update_notice_api } from '~/api/notice.js'
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from '~/composables/util.js'

const tableData = ref([])
const isLoading = ref(false)
const page = ref(1)
const totalCount = ref(0)
// 获取表单数据
function getTableData(p = null) {
    if (typeof p == 'number') {
        page.value = p
    }
    isLoading.value = true
    get_noticeList_api({
        page: page.value
    }).then(res => {
        tableData.value = res.list
        totalCount.value = res.totalCount
    }).finally(() => {
        isLoading.value = false
    })
    
}

getTableData()


// 切换分页
const changePage = (e) => {
    getTableData(e)
}

// 表单部分

const editId = ref(0)
const formDrawerRef = ref(null)
const drawerTitle = computed(() => editId.value == 0 ? '添加' : '修改')
const formRef = ref(null)
const formData = reactive({
    title: '',
    content: ''
})

const rules = {
    title: [
        { required: true, message: '请填写公告标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请填写公告内容', trigger: 'blur' }
    ]
}
// 打开抽屉
const openDrawer = () => formDrawerRef.value.open()
// 关闭抽屉
const closeDrawer = () => {
    editId.value = 0
    Object.assign(formData, {
        title: '',
        content: ''
    })
}
// 提交
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) return
        formDrawerRef.value.showLoading()

        const resultFunc = editId.value == 0 ? 
            add_notice_api(formData) : 
            update_notice_api({
                id: editId.value,
                ...formData
            })

            resultFunc
            .then(res => {
                toast(drawerTitle.value + '成功')
                getTableData(editId.value == 0 ? 1 : null)
                
                formDrawerRef.value.close()
            })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}

// 编辑
const handleEdit = (index, row) => {
    for (const key in formData) {
        formData[key] = row[key]
    }
    editId.value = row.id
    openDrawer()
}
// 删除
const handleDelete = (id) => {
    isLoading.value = true
    delete_notice_api({ id })
    .then(res => {
        toast('删除成功')
        getTableData()
    })
    .finally(() => {
        isLoading.value = false
    })
}

</script>

<style lang="scss" scoped>

</style>